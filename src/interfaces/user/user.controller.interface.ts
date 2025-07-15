import { NextFunction, Request, Response } from "express";





export interface IUserController {

    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}