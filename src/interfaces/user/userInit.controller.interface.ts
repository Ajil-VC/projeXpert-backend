import { NextFunction, Request, Response } from "express";


export interface IUserInitController {

    getInitData(req: Request, res: Response, next: NextFunction): Promise<void>;

    getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;

    updateNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}