import { NextFunction, Request, Response } from "express";



export interface IActivityController {

    getActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
}