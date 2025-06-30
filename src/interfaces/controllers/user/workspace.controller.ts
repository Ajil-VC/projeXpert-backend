import { NextFunction, Request, Response } from "express";
import { createWorkspaceUsecase } from "../../../config/Dependency/user/workspace.di";

import { HttpStatusCode } from "../http-status.enum";

export const createWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { workspaceName } = req.body;

        const result = await createWorkspaceUsecase.execute(workspaceName, req.user.companyId);

        res.status(HttpStatusCode.CREATED).json({ status: true, message: 'Workspace created', result });
        return;

    } catch (err) {
        next(err);
    }
}
