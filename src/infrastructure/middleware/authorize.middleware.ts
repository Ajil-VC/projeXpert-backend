import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../config/http-status.enum";
import { Permissions } from "../database/models/role.interface";


export class AuthorizeMiddleware {

    constructor() { }

    has = (requiredPermissions: Permissions[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userPermissions = req.user.role.permissions;

                const hasAccess = requiredPermissions.every(permission => userPermissions.includes(permission));

                if (!hasAccess) {
                    res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: 'User doesnt have permission to make this operation.' });
                    return;
                }
                next();

            } catch (err) {
                next(err);
            }
        };
    };

    hasAny = (requiredPermissions: Permissions[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userPermissions = req.user.role.permissions;
                const hasAccess = requiredPermissions.some(permission => userPermissions.includes(permission));

                if (!hasAccess) {
                    res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: 'User doesnt have permission to make this operation.' });
                    return;
                }
                next();

            } catch (err) {
                next(err);
            }
        };
    };

}