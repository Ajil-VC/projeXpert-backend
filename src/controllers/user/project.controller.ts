import { NextFunction, Request, Response } from "express";

import {
    IAddMemberUsecase,
    ICreateProjectUsecase,
    IDeleteProjectUsecase,
    IGetCurrentProjectUsecase,
    IGetProjectsinWorkspaceUsecase,
    IGetWorkspaceUsecase,
    IProjectStatusUsecase,
    IRemoveMemberUsecase,
    IRetrieveProjectUsecase,
    IUpdateProjectUsecase
} from "../../config/Dependency/user/project.di";


import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IProjectController } from "../../interfaces/user/project.controller.interface";
import { IAddActivityUsecase } from "../../config/Dependency/user/activity.di";
import { IGetTasksUsecase } from "../../config/Dependency/user/backlog.di";


export class ProjectController implements IProjectController {

    constructor(
        private _getWorkspaceUsecase: IGetWorkspaceUsecase,
        private _createProjectUsecase: ICreateProjectUsecase,
        private _getProjectsInWorkspaceUsecase: IGetProjectsinWorkspaceUsecase,
        private _getCurrentProjectUsecase: IGetCurrentProjectUsecase,
        private _getTasksUsecase: IGetTasksUsecase,
        private _addMemberUsecase: IAddMemberUsecase,
        private _removeMemberUsecase: IRemoveMemberUsecase,
        private _updateProjectUsecase: IUpdateProjectUsecase,
        private _deleteProjectUsecase: IDeleteProjectUsecase,
        private _projectStatsUse: IProjectStatusUsecase,
        private _retrieveProjectUsecase: IRetrieveProjectUsecase,
        private _addActivityUsecase: IAddActivityUsecase
    ) { }


    projectStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.params.projectId;
            const groupedData = await this._projectStatsUse.execute(projectId, req.user.id, req.user.role, req.user.companyId);

            if (!groupedData) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No tasks found' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, result: groupedData });
            return;

        } catch (err) {
            next(err);
        }
    }


    getProjectsInitData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const workSpaces = await this._getWorkspaceUsecase.execute(req.user);
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


    createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { projectName, workSpace, priority } = req.body;
            const createdProject = await this._createProjectUsecase.execute(projectName, workSpace, priority, req.user);

            res.status(HttpStatusCode.CREATED).json({ status: true, createdProject });
            return;

        } catch (err) {
            next(err);
        }
    }


    getProjectData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            if (typeof req.query.workspace_id !== 'string') throw new Error('Workspace id is not valid string');

            const active = req.query.active === 'true';
            const archived = req.query.archived === 'true';
            const completed = req.query.completed === 'true';
            const filter = [];

            if (active) filter.push('active');
            if (archived) filter.push('archived');
            if (completed) filter.push('completed');

            if (!active && !archived && !completed) {
                filter.push('active', 'archived', 'completed');
            }

            const page = req.query.page;
            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 6;
            const skip = (pageNum - 1) * limit;

            const data = await this._getProjectsInWorkspaceUsecase.execute(req.query.workspace_id, limit, skip, filter);
            res.status(HttpStatusCode.OK).json({ status: true, projects: data.projects, totalPages: data.totalPage });

        } catch (err) {
            next(err);
        }
    }


    getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.project_id;
            const workspaceId = req.query.workspace_id;

            if (typeof projectId !== 'string' || typeof workspaceId !== 'string') {
                throw new Error('project id or workspace id is not valid string');
            }

            const result = await this._getCurrentProjectUsecase.execute(workspaceId, projectId);

            const tasks = await this._getTasksUsecase.execute(projectId, req.user.role.permissions, req.user.id);

            res.status(HttpStatusCode.OK).json({ status: true, result, tasks });
            return;

        } catch (err) {

            next(err);
        }
    }

    retrieveProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const projectId = req.query.project_id;
            if (typeof projectId !== 'string') {
                throw new Error('project id is not valid string');
            }

            const result = await this._retrieveProjectUsecase.execute(projectId);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { email, projectId, workSpaceId, roleId } = req.body;

            const updatedProjectData = await this._addMemberUsecase.execute(email, projectId, workSpaceId, req.user.companyId, roleId);
            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'Added', email);

            res.status(HttpStatusCode.OK).json({
                status: true, message: 'Member added to the project successfully', updatedProjectData
            });

        } catch (err) {

            next(err);
        }
    }

    removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { userId, projectId } = req.body;

            await this._removeMemberUsecase.execute(projectId, userId, req.user.id);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Member removed from project' });
            return;

        } catch (err) {
            next(err);

        }
    }


    updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { _id, name, status, priority, members } = req.body.projectData;
            const workSpaceId = req.body.workSpaceId;

            const updatedProject = await this._updateProjectUsecase.execute(_id, name, status, priority, members, req.user.email);
            await this._addActivityUsecase.execute(_id, req.user.companyId, req.user.id, 'updated', 'project');

            res.status(HttpStatusCode.OK).json({ status: true, data: updatedProject });
            return;

        } catch (err) {
            next(err)
        }
    }


    deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.params.projectId;
            const workSpaceId = req.params.workSpaceId;

            const result = await this._deleteProjectUsecase.execute(projectId, workSpaceId);
            if (result) {
                res.status(HttpStatusCode.NO_CONTENT).json({ status: true, message: RESPONSE_MESSAGES.PROJECT.DELETED });
                return;
            }

        } catch (err) {

            next(err);
        }

    }


}
