import { NextFunction, Request, Response } from "express";


export interface IRevenueController {

    getRevenueReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}