import { NextFunction, Request, Response } from "express";


export interface IProjectController {

    getProjectsInitData(req: Request, res: Response, next: NextFunction): Promise<void>;

    createProject(req: Request, res: Response, next: NextFunction): Promise<void>;

    getProjectData(req: Request, res: Response, next: NextFunction): Promise<void>;

    getProject(req: Request, res: Response, next: NextFunction): Promise<void>;

    removeMember(req: Request, res: Response, next: NextFunction): Promise<void>;

    updateProject(req: Request, res: Response, next: NextFunction): Promise<void>;

    deleteProject(req: Request, res: Response, next: NextFunction): Promise<void>;

    projectStats(req: Request, res: Response, next: NextFunction): Promise<void>;

    retrieveProject(req: Request, res: Response, next: NextFunction): Promise<void>;

    addMember(req: Request, res: Response, next: NextFunction): Promise<void>;
}