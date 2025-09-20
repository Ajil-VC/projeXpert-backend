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


function verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
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

        const decoded: any = await verifyToken(token, config.JWT_SECRETKEY);
        req.user = decoded;

        req.user = decoded;
        if (req.user.systemRole !== 'platform-admin') {
            res.status(403).json({ status: false, message: 'Unautherized: not Admin' });
            return;
        }

        next();

    } catch (err: any) {

        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            res.status(401).json({ status: false, message: 'Invalid or expired token.' });
            return
        }

        next(err);
    }

}
