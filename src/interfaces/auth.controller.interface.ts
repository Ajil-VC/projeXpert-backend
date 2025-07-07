import { NextFunction, Request, Response } from "express";



export interface IAuthController {


    sendOtpToMail(req: Request, res: Response, next: NextFunction): Promise<void>;

    validateOtp(req: Request, res: Response, next: NextFunction): Promise<void>;

    signIn(req: Request, res: Response, next: NextFunction): Promise<void>;

    createCompany(req: Request, res: Response, next: NextFunction): Promise<void>;

    changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;

    isVerified(req: Request, res: Response, next: NextFunction): Promise<void>;

    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;

}