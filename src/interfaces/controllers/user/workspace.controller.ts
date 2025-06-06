import { Request, Response } from "express";
import { createWorkspaceUsecase } from "../../../config/Dependency/user/workspace.di";


export const createWorkspace = async (req: Request, res: Response): Promise<void> => {
    try {

        const { workspaceName } = req.body;

        const result = await createWorkspaceUsecase.execute(workspaceName, req.user.companyId);
        if (!result) {
            throw new Error('Error occured while trying to create workspace');
        }

        res.status(201).json({ status: true, message: 'Workspace created', result });
        return;

    } catch (err) {
        console.error('Something went wrong while creating workspace', err);
        res.status(500).json({ status: false, message: 'Something went wrong while creating workspace' });

    }
}
