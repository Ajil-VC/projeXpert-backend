import { NextFunction, Request, Response } from "express";


export interface IRevenue {

    getRevenueReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}