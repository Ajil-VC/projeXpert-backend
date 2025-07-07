
import { Request, Response, NextFunction } from "express";

export interface IBacklogController {

    createEpic(req: Request, res: Response, next: NextFunction): Promise<void>;

    updateEpic(req: Request, res: Response, next: NextFunction): Promise<void>;

    createIssue(req: Request, res: Response, next: NextFunction): Promise<void>;

    createSprint(req: Request, res: Response, next: NextFunction): Promise<void>;

    getSprints(req: Request, res: Response, next: NextFunction): Promise<void>;

    getTasks(req: Request, res: Response, next: NextFunction): Promise<void>;

    assignIssue(req: Request, res: Response, next: NextFunction): Promise<void>;

    dragDropUpdate(req: Request, res: Response, next: NextFunction): Promise<void>;

    updateTaskDetails(req: Request, res: Response, next: NextFunction): Promise<void>;

    deleteCloudinaryAttachment(req: Request, res: Response, next: NextFunction): Promise<void>;

    changeTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void>;

    startSprint(req: Request, res: Response, next: NextFunction): Promise<void>;

    completeSprint(req: Request, res: Response, next: NextFunction): Promise<void>;

    getComments(req: Request, res: Response, next: NextFunction): Promise<void>;

    addComment(req: Request, res: Response, next: NextFunction): Promise<void>;

}
