import { NextFunction, Request, Response } from "express";





export interface IUserController {

    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;

    createRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRoles(req: Request, res: Response, next: NextFunction): Promise<void>;

    updateRoleData(req: Request, res: Response, next: NextFunction): Promise<void>;

    deleteRole(req: Request, res: Response, next: NextFunction): Promise<void>;
}
