import { NextFunction, Request, Response } from "express";



export interface IWorkSpaceController {

    createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void>;

    getWorkspace(req: Request, res: Response, next: NextFunction): Promise<void>;
}