import { Request, Response } from "express";
import { GetWorkSpaceUseCase } from "../../../application/usecase/workspaceUsecase/getWorkspace.usecase";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/workspace.repositoryImp";
import { createProjectUseCase } from "../../../application/usecase/projectUseCase/createProject.usecase";
import { projectRepositoryImp } from "../../../infrastructure/repositories/project.repositoryImp";
import { GetAllProjectsInWorkspaceUseCase } from "../../../application/usecase/projectUseCase/getAllProjectsInWorkspace.usecase";
import { userRepositoryImp } from "../../../infrastructure/repositories/user.repositoryImp";
import { AddMemberUseCase } from "../../../application/usecase/projectUseCase/addMember.usecase";
import { EmailServiceImp } from "../../../infrastructure/services/email.serviceImp";
import { UpdateProjectUseCase } from "../../../application/usecase/projectUseCase/updateProject.usecase";
import { DeleteProjectUsecase } from "../../../application/usecase/projectUseCase/deleteProject.usecase";
import { SecurePasswordImp } from "../../../infrastructure/services/securepassword.serviceImp";
import { RemoveMemberUseCase } from "../../../application/usecase/projectUseCase/removeMember.usecase";
import { GetProjectUseCase } from "../../../application/usecase/projectUseCase/getProject.usecase";
import { BacklogRepositoryImp } from "../../../infrastructure/repositories/backlog.repositoryImp";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";

const workSpacdRepositoryOb = new WorkspaceRepoImp();
const getWorkSpacesUsecaseOb = new GetWorkSpaceUseCase(workSpacdRepositoryOb);
const userRepositoryOb = new userRepositoryImp();
const projectRepositoryOb = new projectRepositoryImp(userRepositoryOb);
const createProjectUseCaseOb = new createProjectUseCase(projectRepositoryOb);
const getProjectsInWorkSpaceOb = new GetAllProjectsInWorkspaceUseCase(projectRepositoryOb);
const emailServiceOb = new EmailServiceImp();
const securePasswordOb = new SecurePasswordImp();
const addMemberUsecaseOb = new AddMemberUseCase(userRepositoryOb, emailServiceOb, projectRepositoryOb, securePasswordOb);
const updateProjectUseCaseOb = new UpdateProjectUseCase(projectRepositoryOb, userRepositoryOb);
const deleteProjectUsecaseOb = new DeleteProjectUsecase(projectRepositoryOb);
const removeMemberUsecaseOb = new RemoveMemberUseCase(projectRepositoryOb);
const getCurProjectUsecaseOb = new GetProjectUseCase(projectRepositoryOb);

const backlogRepositoryOb = new BacklogRepositoryImp();
const getTasksUseCaseOb = new GetTasksUseCase(backlogRepositoryOb);

export const getProjectsInitData = async (req: Request, res: Response): Promise<void> => {

    try {

        const workSpaces = await getWorkSpacesUsecaseOb.execute(req.user);
        if (!workSpaces) {
            res.status(404).json({ status: false, message: 'No data available' });
            return;
        }

        res.status(200).json({ status: true, data: workSpaces });
        return;

    } catch (err) {
        console.error('Something went wrong while getting project init data.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while getting project init data.' });
    }
}


export const createProject = async (req: Request, res: Response): Promise<void> => {

    try {
        const { projectName, workSpace, priority } = req.body;
        const createdProject = await createProjectUseCaseOb.execute(projectName, workSpace, priority, req.user);

        if (!createdProject) {
            res.status(500).json({ status: true, message: 'Couldnt create the project. Internal server error.' });
            return;
        }

        res.status(201).json({ status: true, createdProject });
        return;

    } catch (err) {
        console.error('Something went wrong while creating project', err);
        res.status(500).json({ status: false, message: 'Something went wrong while creating project' });
    }
}



export const getProjectData = async (req: Request, res: Response): Promise<void> => {

    try {

        if (typeof req.query.workspace_id !== 'string') throw new Error('Workspace id is not valid string');
        const data = await getProjectsInWorkSpaceOb.execute(req.query.workspace_id);
        res.status(200).json({ status: true, projects: data });

    } catch (err) {
        console.error('Internal server error while fetching project details', err);
        res.status(500).json({ status: false, message: 'Internal server error while feching project details.' });
        return;
    }
}

export const getProject = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.query.project_id;
        const workspaceId = req.query.workspace_id;


        if (typeof projectId !== 'string' || typeof workspaceId !== 'string') {
            throw new Error('project id or workspace id is not valid string');
        }
        const result = await getCurProjectUsecaseOb.execute(workspaceId, projectId);
        if (!result) throw new Error('Somthing went wrong while fetching project data.');

        const tasks = await getTasksUseCaseOb.execute(projectId, req.user.role, req.user.id);

        res.status(200).json({ status: true, result, tasks });
        return;

    } catch (err) {

        console.error('Internal server error while fetching project details', err);
        res.status(500).json({ status: false, message: 'Internal server error while feching project details.' });
        return;

    }
}

export const addMember = async (req: Request, res: Response): Promise<void> => {

    try {

        const { email, projectId, workSpaceId } = req.body;
        const updatedProjectData = await addMemberUsecaseOb.execute(email, projectId, workSpaceId, req.user.companyId);
        if (!updatedProjectData) throw new Error('Member not added');

        res.status(200).json({
            status: true, message: 'Member added to the project successfully', updatedProjectData
        });

    } catch (err) {

        console.error('Internal server error while adding members into the project', err);
        res.status(500).json({ status: false, message: 'Internal server error while adding members into the project' });
        return;
    }
}


export const removeMember = async (req: Request, res: Response): Promise<void> => {

    try {

        const { userId, projectId } = req.body;

        const result = await removeMemberUsecaseOb.execute(projectId, userId, req.user.id);
        if (!result) throw new Error('Couldnt remove user from projecdt');

        res.status(200).json({ status: true, message: 'Member removed from project' });
        return;

    } catch (err) {

        console.error('Internal server error while removing members from project', err);
        res.status(500).json({ status: false, message: 'Internal server error while removing members from project' });
        return;

    }
}


export const updateProject = async (req: Request, res: Response): Promise<void> => {

    try {

        const { _id, name, status, priority, members } = req.body.projectData;
        const workSpaceId = req.body.workSpaceId;

        const result = await updateProjectUseCaseOb.execute(_id, name, status, priority, members, req.user.email);

        if (!result) {
            res.status(500).json({ status: false, message: 'Something went wrong while updating project' });
            return;
        }

        const projectsInWorkspace = await getProjectsInWorkSpaceOb.execute(workSpaceId);
        if (!projectsInWorkspace) throw new Error('Projects couldnt retrieve');

        res.status(200).json({ status: true, data: projectsInWorkspace });
        return;

    } catch (err) {
        console.error('Error occured while updating project', err);
        res.status(500).json({ status: false, message: 'Something went wrong while updating project', err });
        return;
    }
}


export const deleteProject = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.params.projectId;
        const workSpaceId = req.params.workSpaceId;

        const result = await deleteProjectUsecaseOb.execute(projectId, workSpaceId);
        if (result) {
            res.status(200).json({ status: true, message: 'Project deleted successfully' });
            return;
        }
        res.status(500).json({ status: false, message: 'Project couldnt delete successfully' });
        return;

    } catch (err) {
        console.error("Error occured while deleting project", err);
        res.status(500).json({ status: false, message: "Error occured while deleting project" })
        return;
    }

}