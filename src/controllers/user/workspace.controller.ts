import { NextFunction, Request, Response } from "express";
import { ICreateWorkspaceUsecase, ISelectWorkspaceUsecase } from "../../config/Dependency/user/workspace.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IWorkSpaceController } from "../../interfaces/user/workspace.controller.interface";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";


export class WorkSpaceController implements IWorkSpaceController {


    constructor(
        private _createWorkspaceUsecase: ICreateWorkspaceUsecase,
        private _selectWorkSpace: ISelectWorkspaceUsecase
    ) { }


    getWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const workSpaceId = req.query.workspace_id;
            if (typeof workSpaceId !== 'string') {
                throw new Error('Workspace id must be string type');
            }
            const result = await this._selectWorkSpace.execute(workSpaceId, req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.COMMON.SUCCESS, result });

            return;

        } catch (err) {
            next(err);
        }
    }

    createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const { workspaceName } = req.body;

            const result = await this._createWorkspaceUsecase.execute(workspaceName, req.user.companyId, req.user.id);

            if (!result.status) {
                res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: result.message });
                return;
            }

            res.status(HttpStatusCode.CREATED).json({ status: true, message: result.message, result: result.additional });
            return;

        } catch (err) {
            next(err);
        }
    }


}

