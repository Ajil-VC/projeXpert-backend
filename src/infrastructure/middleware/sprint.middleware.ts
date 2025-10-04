import { NextFunction, Request, Response } from "express";
import { IGetSprintWithIDUsecase } from "../../config/Dependency/user/backlog.di";
import { IGetTaskUsecase } from "../../config/Dependency/user/task.di";
import { Sprint } from "../database/models/sprint.interface";
import { HttpStatusCode } from "../../config/http-status.enum";





export class SprintMiddleware {

    constructor(private _getSprintWithId: IGetSprintWithIDUsecase, private _getTask: IGetTaskUsecase) { }

    canMutate = (issueType: 'sprint' | 'task') => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {

                const id =
                    req.body?.completingSprintId ||
                    req.body?.issueId ||
                    req.body?.parentId ||
                    req.params?.taskId ||
                    req.body?.taskId;


                if (!id) {
                    res.status(HttpStatusCode.BAD_REQUEST).json({
                        status: false,
                        message: "Id is required",
                    });
                    return;
                }


                let sprintId = id;
                if (issueType === 'task') {
                    const task = await this._getTask.execute(id);
                    if (task.parentId) {
                        const parentTask = await this._getTask.execute(task.parentId as unknown as string);
                        if (!parentTask.sprintId) {
                            next();
                            return;
                        }
                        sprintId = parentTask.sprintId as unknown as string;

                    } else if (!task.sprintId) {
                        next();
                        return;
                    } else {
                        sprintId = (task.sprintId as Sprint)._id as unknown as string;
                    }
                }
                const sprint = await this._getSprintWithId.execute(sprintId);
                if (sprint.status === 'completed') {
                    let msg = 'The sprint is already completed! Cannot make updations on it.Moving To Active Sprint.';
                    if (issueType === 'task') {
                        msg = 'This task is under completed sprint! Cannot make updations on it.';
                    }
                    res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: msg });
                    return;
                }
                next();

            } catch (err) {
                next(err);
            }
        };
    };


}