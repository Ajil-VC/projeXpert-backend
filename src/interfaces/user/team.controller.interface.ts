import { NextFunction, Request, Response } from "express";


export interface ITeamController {

    getTeam(req: Request, res: Response, next: NextFunction): Promise<void>;

    getCompanyUsers(req: Request, res: Response, next: NextFunction): Promise<void>;

    restrictUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}