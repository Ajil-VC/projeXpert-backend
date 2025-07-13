import { NextFunction, Request, Response } from "express";



export interface IStripeController {

    checkout(req: Request, res: Response, next: NextFunction): Promise<void>;

    webhookHandler(req: Request, res: Response, next: NextFunction): Promise<void>;

    verifySubscription(req: Request, res: Response, next: NextFunction): Promise<void>;

    getSubscriptionDetails(req: Request, res: Response, next: NextFunction): Promise<void>;

}   