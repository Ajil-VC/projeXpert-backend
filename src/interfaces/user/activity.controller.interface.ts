import { NextFunction, Request, Response } from "express";
import { Activity } from "../../infrastructure/database/models/activity.interface";



export interface IActivityController {

    getActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
}