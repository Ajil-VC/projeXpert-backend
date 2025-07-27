import { NextFunction, Request, Response } from "express";



export interface IStripeAdminController {

    changePlanStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

    deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>;

    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;

    getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
}