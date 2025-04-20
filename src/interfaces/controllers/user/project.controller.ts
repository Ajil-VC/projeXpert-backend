import { Request, Response } from "express";
import { GetWorkSpaceUseCase } from "../../../application/usecase/workspaceUsecase/getWorkspace.usecase";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/workspace.repositoryImp";
import { createProjectUseCase } from "../../../application/usecase/projectUseCase/createProject.usecase";
import { projectRepositoryImp } from "../../../infrastructure/repositories/project.repositoryImp";

const workSpacdRepositoryOb = new WorkspaceRepoImp();
const getWorkSpacesUsecaseOb = new GetWorkSpaceUseCase(workSpacdRepositoryOb);
const projectRepositoryOb = new projectRepositoryImp();
const createProjectUseCaseOb = new createProjectUseCase(projectRepositoryOb);

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