import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../../config/config";


// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const authenticatePlatformAdmin = async (req: Request, res: Response, next: NextFunction) => {

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

        jwt.verify(token, config.JWT_SECRETKEY, (err, decoded: any) => {

            if (err) {
                res.status(401).json({ status: false, message: 'Error while verifying jwt.' });
                return
            }

            req.user = decoded;
            if (req.user.systemRole !== 'platform-admin') {
                res.status(403).json({ status: false, message: 'Unautherized: not Admin' });
                return;
            }
            console.log('Admin Authentication: ', req.user)
            next();

        });

    } catch (err) {
        next(err);
    }

}
