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


    jwt.verify(token, config.JWT_SECRETKEY, (err, decoded: any) => {

        if (err) return res.status(403).json({ status: false, message: 'Error while verifying jwt.' });

        req.user = decoded;
        console.log('Authentication: ',req.user)
        next();
    });

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


    jwt.verify(token, config.JWT_SECRETKEY, (err, decoded: any) => {

        if (err) return res.status(403).json({ status: false, message: 'Invalide Token' });

        req.user = decoded;

        if (req.user.role !== 'admin') {
            res.status(403).json({ status: false, message: 'Access denied: Admins only' });
            return 
        }
        next();
    });

}