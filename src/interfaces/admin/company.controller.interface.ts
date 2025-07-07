import { NextFunction, Request, Response } from "express";

export interface ICompanyManagement {

    changeUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

    changeCompanyStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}