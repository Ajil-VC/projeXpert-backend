import { NextFunction, Request, Response } from "express";


export interface IAdminInit {

    dashBoard(req: Request, res: Response, next: NextFunction): Promise<void>;

    platFormData(req: Request, res: Response, next: NextFunction): Promise<void>;

    getAdminData(req: Request, res: Response, next: NextFunction): Promise<void>;
}