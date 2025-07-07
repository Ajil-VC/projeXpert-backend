import { NextFunction, Request, Response } from "express";


export interface ITeamController {

    getTeam(req: Request, res: Response, next: NextFunction): Promise<void>;
}