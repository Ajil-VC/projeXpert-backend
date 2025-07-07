import { NextFunction, Request, Response } from "express";

import { getWorkspaceUsecase } from "../../config/Dependency/user/project.di";
import { createProjectUsecase } from "../../config/Dependency/user/project.di";
import { getProjectsInWorkspaceUsecase } from "../../config/Dependency/user/project.di";
import { getCurrentProjectUsecase } from "../../config/Dependency/user/project.di";
import { addMemberUsecase } from "../../config/Dependency/user/project.di";
import { removeMemberUsecase } from "../../config/Dependency/user/project.di";
import { updateProjectUsecase } from "../../config/Dependency/user/project.di";
import { deleteProjectUsecase } from "../../config/Dependency/user/project.di";
import { getTasksUsecase } from "../../config/Dependency/user/project.di";

import { HttpStatusCode } from "../http-status.enum";
import { RESPONSE_MESSAGES } from "../response-messages.constant";
import { IProjectController } from "../../interfaces/user/project.controller.interface";
import { GetWorkSpaceUseCase } from "../../application/usecase/workspaceUsecase/getWorkspace.usecase";
import { createProjectUseCase } from "../../application/usecase/projectUseCase/createProject.usecase";
import { GetAllProjectsInWorkspaceUseCase } from "../../application/usecase/projectUseCase/getAllProjectsInWorkspace.usecase";
import { GetProjectUseCase } from "../../application/usecase/projectUseCase/getProject.usecase";
import { GetTasksUseCase } from "../../application/usecase/backlogUseCase/getTasks.usecase";
import { AddMemberUseCase } from "../../application/usecase/projectUseCase/addMember.usecase";
import { RemoveMemberUseCase } from "../../application/usecase/projectUseCase/removeMember.usecase";
import { UpdateProjectUseCase } from "../../application/usecase/projectUseCase/updateProject.usecase";
import { DeleteProjectUsecase } from "../../application/usecase/projectUseCase/deleteProject.usecase";


export class ProjectController implements IProjectController {

    private getWorkspaceUsecase: GetWorkSpaceUseCase;
    private createProjectUsecase: createProjectUseCase;
    private getProjectsInWorkspaceUsecase: GetAllProjectsInWorkspaceUseCase;
    private getCurrentProjectUsecase: GetProjectUseCase;
    private getTasksUsecase: GetTasksUseCase;
    private addMemberUsecase: AddMemberUseCase;
    private removeMemberUsecase: RemoveMemberUseCase;
    private updateProjectUsecase: UpdateProjectUseCase;
    private deleteProjectUsecase: DeleteProjectUsecase;
    constructor() {

        this.getWorkspaceUsecase = getWorkspaceUsecase;
        this.createProjectUsecase = createProjectUsecase;
        this.getProjectsInWorkspaceUsecase = getProjectsInWorkspaceUsecase;
        this.getCurrentProjectUsecase = getCurrentProjectUsecase;
        this.getTasksUsecase = getTasksUsecase;
        this.addMemberUsecase = addMemberUsecase;
        this.removeMemberUsecase = removeMemberUsecase;
        this.updateProjectUsecase = updateProjectUsecase;
        this.deleteProjectUsecase = deleteProjectUsecase;
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


    addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { email, projectId, workSpaceId } = req.body;
            const updatedProjectData = await this.addMemberUsecase.execute(email, projectId, workSpaceId, req.user.companyId);

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
