import { Request, Response } from "express";
import { CreateEpicUsecase } from "../../../application/usecase/backlogUseCase/createEpic.usecase";
import { BacklogRepositoryImp } from "../../../infrastructure/repositories/backlog.repositoryImp";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";


const backlogRepositoryOb = new BacklogRepositoryImp();
const createEpicUseCaseOb = new CreateEpicUsecase(backlogRepositoryOb);
const getTasksUseCaseOb = new GetTasksUseCase(backlogRepositoryOb);

export const createEpic = async (req: Request, res: Response): Promise<void> => {

    try {

        const { epicName, projectId } = req.body;
        const result = await createEpicUseCaseOb.execute(epicName, projectId);
        if (!result) throw new Error('Error while creating task');

        res.status(201).json({ status: true, result });
        return;

    } catch (err) {

        console.error('Something went wrong while creating epic.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while creating epic' });

    }
}


export const getTasks = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.query.projectId;
        console.log(projectId);

        if (typeof projectId !== 'string') throw new Error('Project id is not valid string');

        const result = await getTasksUseCaseOb.execute(projectId, req.user.role, req.user.id);

        res.status(200).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while getting tasks', err);
        res.status(500).json({ status: false, message: 'Something went wrong while getting tasks' });
    }
}