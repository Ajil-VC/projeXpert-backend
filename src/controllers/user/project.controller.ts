import { NextFunction, Request, Response } from "express";

import { 
    IAddMember, 
    ICreateProject, 
    IDeleteProject, 
    IGetCurrentProject, 
    IGetProjectsinWorkspace, 
    IGetWorkspace, 
    IProjectStatus, 
    IRemoveMember, 
    IRetrieveProject, 
    IUpdateProject } from "../../config/Dependency/user/project.di";


import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IProjectController } from "../../interfaces/user/project.controller.interface";
import { IAddActivity } from "../../config/Dependency/user/activity.di";
import { IGetTasks } from "../../config/Dependency/user/backlog.di";


export class ProjectController implements IProjectController {

    constructor(
        private getWorkspaceUsecase: IGetWorkspace,
        private createProjectUsecase: ICreateProject,
        private getProjectsInWorkspaceUsecase: IGetProjectsinWorkspace,
        private getCurrentProjectUsecase: IGetCurrentProject,
        private getTasksUsecase: IGetTasks,
        private addMemberUsecase: IAddMember,
        private removeMemberUsecase: IRemoveMember,
        private updateProjectUsecase: IUpdateProject,
        private deleteProjectUsecase: IDeleteProject,
        private projectStatsUse: IProjectStatus,
        private retrieveProjectUsecase: IRetrieveProject,
        private addActivityUsecase: IAddActivity
    ) { }


    projectStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.params.projectId;
            const groupedData = await this.projectStatsUse.execute(projectId, req.user.id, req.user.role);

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

            const workSpaces = await this.getWorkspaceUsecase.execute(req.user);
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
            const createdProject = await this.createProjectUsecase.execute(projectName, workSpace, priority, req.user);

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

            const data = await this.getProjectsInWorkspaceUsecase.execute(req.query.workspace_id, limit, skip, filter);
            res.status(HttpStatusCode.OK).json({ status: true, projects: data.projects, totalPages: data.totalPage });

        } catch (err) {
            next(err);
        }
    }


    getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.project_id;
            const workspaceId = req.query.workspace_id;
console.log('Yeeeess workingnnnn......................')
            if (typeof projectId !== 'string' || typeof workspaceId !== 'string') {
                throw new Error('project id or workspace id is not valid string');
            }

            const result = await this.getCurrentProjectUsecase.execute(workspaceId, projectId);

            const tasks = await this.getTasksUsecase.execute(projectId, req.user.role, req.user.id);

            res.status(HttpStatusCode.OK).json({ status: true, result, tasks });
            return;

        } catch (err) {

            next(err);
        }
    }

    retrieveProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const projectId = req.query.project_id;
console.log('\n\n\n\n\n\n\n\n\n\n\n\n\nAjil hahahaha \n\n\n\n\n\n\n\n\n\n\n\n\n\n')
            if (typeof projectId !== 'string') {
                throw new Error('project id is not valid string');
            }

            const result = await this.retrieveProjectUsecase.execute(projectId);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { email, projectId, workSpaceId } = req.body;
            const updatedProjectData = await this.addMemberUsecase.execute(email, projectId, workSpaceId, req.user.companyId);
            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'Added', email);

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

            await this.removeMemberUsecase.execute(projectId, userId, req.user.id);

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

            const updatedProject = await this.updateProjectUsecase.execute(_id, name, status, priority, members, req.user.email);
            await this.addActivityUsecase.execute(_id, req.user.companyId, req.user.id, 'updated', 'project');

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

            const result = await this.deleteProjectUsecase.execute(projectId, workSpaceId);
            if (result) {
                res.status(HttpStatusCode.NO_CONTENT).json({ status: true, message: RESPONSE_MESSAGES.PROJECT.DELETED });
                return;
            }

        } catch (err) {

            next(err);
        }

    }


}
