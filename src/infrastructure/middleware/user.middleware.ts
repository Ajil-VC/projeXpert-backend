import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../../config/config";
import { isCompanyBlocked } from "../../config/Dependency/auth/auth.di";
import { Company } from "../database/models/company.interface";
import { isUserBlocked } from "../../config/Dependency/auth/auth.di";



declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ status: false, message: 'Unauthorized: Token missing or invalid token' });
        return
    }

    const token = authHeader.split(' ')[1];

    if (!config.JWT_SECRETKEY) {
        throw new Error('JWT secret key is not defined.');
    }


    try {

        jwt.verify(token, config.JWT_SECRETKEY, async (err, decoded: any) => {

            if (err) {
                res.status(401).json({ status: false, message: 'Invalid or expired token.' });
                return
            }

            req.user = decoded;

            const [userData, companyData] = await Promise.all([
                isUserBlocked.execute(req.user.id),
                isCompanyBlocked.execute(req.user.companyId) as Promise<Company>
            ]);

            if (userData.isBlocked) {
                res.status(403).json({ status: false, message: 'User account is blocked.' })
                return;
            }

            if (!req.user.companyId || !companyData) {
                res.status(401).json({ status: false, message: 'Company data not available.' });
                return;
            }

            if (companyData.isBlocked) {
                res.status(403).json({ status: false, message: 'Company blocked' });
                return;
            }

            if (req.user.isBlocked) {
                res.status(403).json({ status: false, message: 'User account is blocked.' });
                return;
            }
            console.log('Authentication: ', req.user)
            next();

        });

    } catch (err) {
        next(err);
    }

}

export const authenticateAsAdmin = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ status: false, message: 'Unauthorized: Token missing or invalid token' });
        return
    }

    const token = authHeader.split(' ')[1];

    if (!config.JWT_SECRETKEY) {
        throw new Error('JWT secret key is not defined.');
    }


    try {

        jwt.verify(token, config.JWT_SECRETKEY, async (err, decoded: any) => {

            if (err) return res.status(401).json({ status: false, message: 'Invalid or expired token.' });

            req.user = decoded;


            const companyData = await isCompanyBlocked.execute(req.user.companyId) as Company;

            if (!req.user.companyId || !companyData) {
                res.status(403).json({ status: false, message: 'Company data not available.' });
                return;
            }

            if (companyData.isBlocked) {
                res.status(403).json({ status: false, message: 'Company blocked' });
                return;
            }

            if (req.user.isBlocked) {
                res.status(403).json({ status: false, message: 'User account is blocked.' });
                return;
            }

            if (req.user.role !== 'admin') {
                res.status(403).json({ status: false, message: 'Access denied: Admins only' });
                return
            }
            next();
        });

    } catch (err) {
        next(err);
    }

}