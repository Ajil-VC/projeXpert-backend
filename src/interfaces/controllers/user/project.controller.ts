import { NextFunction, Request, Response } from "express";

import { getWorkspaceUsecase } from "../../../config/Dependency/user/project.di";
import { createProjectUsecase } from "../../../config/Dependency/user/project.di";
import { getProjectsInWorkspaceUsecase } from "../../../config/Dependency/user/project.di";
import { getCurrentProjectUsecase } from "../../../config/Dependency/user/project.di";
import { addMemberUsecase } from "../../../config/Dependency/user/project.di";
import { removeMemberUsecase } from "../../../config/Dependency/user/project.di";
import { updateProjectUsecase } from "../../../config/Dependency/user/project.di";
import { deleteProjectUsecase } from "../../../config/Dependency/user/project.di";
import { getTasksUsecase } from "../../../config/Dependency/user/project.di";

import { HttpStatusCode } from "../http-status.enum";
import { RESPONSE_MESSAGES } from "../response-messages.constant";

export const getProjectsInitData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const workSpaces = await getWorkspaceUsecase.execute(req.user);
        if (!workSpaces) {
            res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No data available' });
            return;
        }

        res.status(HttpStatusCode.OK).json({ status: true, data: workSpaces });
        return;

    } catch (err) {
        next(err);
    }
}


export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const { projectName, workSpace, priority } = req.body;
        const createdProject = await createProjectUsecase.execute(projectName, workSpace, priority, req.user);

        res.status(HttpStatusCode.CREATED).json({ status: true, createdProject });
        return;

    } catch (err) {
        next(err);
    }
}



export const getProjectData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        if (typeof req.query.workspace_id !== 'string') throw new Error('Workspace id is not valid string');
        const data = await getProjectsInWorkspaceUsecase.execute(req.query.workspace_id);
        res.status(HttpStatusCode.OK).json({ status: true, projects: data });

    } catch (err) {
        next(err);
    }
}

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const projectId = req.query.project_id;
        const workspaceId = req.query.workspace_id;

        if (typeof projectId !== 'string' || typeof workspaceId !== 'string') {
            throw new Error('project id or workspace id is not valid string');
        }

        const result = await getCurrentProjectUsecase.execute(workspaceId, projectId);

        const tasks = await getTasksUsecase.execute(projectId, req.user.role, req.user.id);

        res.status(HttpStatusCode.OK).json({ status: true, result, tasks });
        return;

    } catch (err) {

        next(err);
    }
}

export const addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { email, projectId, workSpaceId } = req.body;
        const updatedProjectData = await addMemberUsecase.execute(email, projectId, workSpaceId, req.user.companyId);

        res.status(HttpStatusCode.OK).json({
            status: true, message: 'Member added to the project successfully', updatedProjectData
        });

    } catch (err) {

        next(err);
    }
}


export const removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { userId, projectId } = req.body;

        await removeMemberUsecase.execute(projectId, userId, req.user.id);

        res.status(HttpStatusCode.OK).json({ status: true, message: 'Member removed from project' });
        return;

    } catch (err) {
        next(err);

    }
}


export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { _id, name, status, priority, members } = req.body.projectData;
        const workSpaceId = req.body.workSpaceId;

        await updateProjectUsecase.execute(_id, name, status, priority, members, req.user.email);

        const projectsInWorkspace = await getProjectsInWorkspaceUsecase.execute(workSpaceId);

        res.status(HttpStatusCode.OK).json({ status: true, data: projectsInWorkspace });
        return;

    } catch (err) {
        next(err)
    }
}


export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const projectId = req.params.projectId;
        const workSpaceId = req.params.workSpaceId;

        const result = await deleteProjectUsecase.execute(projectId, workSpaceId);
        if (result) {
            res.status(HttpStatusCode.NO_CONTENT).json({ status: true, message: RESPONSE_MESSAGES.PROJECT.DELETED });
            return;
        }

    } catch (err) {

        next(err);
    }

}