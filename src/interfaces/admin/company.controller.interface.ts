import { NextFunction, Request, Response } from "express";

export interface ICompanyManagementController {

    changeUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

    changeCompanyStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

    getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void>;
}