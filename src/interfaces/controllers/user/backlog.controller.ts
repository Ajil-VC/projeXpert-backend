import { Request, Response } from "express";
import { CreateEpicUsecase } from "../../../application/usecase/backlogUseCase/createEpic.usecase";
import { BacklogRepositoryImp } from "../../../infrastructure/repositories/backlog.repositoryImp";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";
import { CreateIssueUsecase } from "../../../application/usecase/backlogUseCase/createIssue.usecase";
import { AssignIssueUseCase } from "../../../application/usecase/backlogUseCase/assignIssue.usecase";
import { CreateSprintUsecase } from "../../../application/usecase/backlogUseCase/createSprint.usecase";
import { GetSprintsUseCase } from "../../../application/usecase/backlogUseCase/getSprint.usecase";
import { get } from "http";
import { DragDropUseCase } from "../../../application/usecase/backlogUseCase/dragDrop.usecase";
import { ChangeTaskStatus } from "../../../application/usecase/backlogUseCase/changeTaskStatus.usecase";
import { StartSprintUsecase } from "../../../application/usecase/backlogUseCase/startSprint.usecase";


const backlogRepositoryOb = new BacklogRepositoryImp();
const getTasksUseCaseOb = new GetTasksUseCase(backlogRepositoryOb);
const createEpicUseCaseOb = new CreateEpicUsecase(backlogRepositoryOb);
const createIssueUseCaseOb = new CreateIssueUsecase(backlogRepositoryOb);
const assignIssueUseCaseOb = new AssignIssueUseCase(backlogRepositoryOb);
const createSprintUseCaseOb = new CreateSprintUsecase(backlogRepositoryOb);
const getSprintsUseCaseOb = new GetSprintsUseCase(backlogRepositoryOb);
const dragDropUseCaseOb = new DragDropUseCase(backlogRepositoryOb);
const taskStatusChangeUseCaseOb = new ChangeTaskStatus(backlogRepositoryOb);
const startSprintUsecaseOb = new StartSprintUsecase(backlogRepositoryOb);

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

export const createIssue = async (req: Request, res: Response): Promise<void> => {

    try {

        const { projectId, issueType, issueName, taskGroup, epicId } = req.body;
        const result = await createIssueUseCaseOb.execute(projectId, issueType, issueName, taskGroup, epicId);

        if (!result) throw new Error('Error occured while creating issue');

        res.status(201).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while creating issue', err);
        res.status(500).json({ status: false, message: 'Something went wrong while creating issue' });

    }
}

export const createSprint = async (req: Request, res: Response): Promise<void> => {

    try {
        const { projectId, issueIds } = req.body;
        const result = await createSprintUseCaseOb.execute(projectId, issueIds, req.user.id);

        if (!result) throw new Error('Error occured while creating sprint');

        res.status(201).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while creating sprint', err);
        res.status(500).json({ status: false, message: 'Something went wrong while creating sprint' });
    }
}

export const getSprints = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId = req.params.projectId;
        if (typeof projectId !== 'string') throw new Error('Project id is not valid string');

        const result = await getSprintsUseCaseOb.execute(projectId);
        if (!result) throw new Error('Error while getting sprints');
        res.status(200).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while getting sprints', err);
        res.status(500).json({ status: false, message: 'Something went wrong while getting sprints' });
    }
}


export const getTasks = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.query.projectId;

        if (typeof projectId !== 'string') throw new Error('Project id is not valid string');

        const result = await getTasksUseCaseOb.execute(projectId, req.user.role, req.user.id);

        res.status(200).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while getting tasks', err);
        res.status(500).json({ status: false, message: 'Something went wrong while getting tasks' });
    }
}


export const assignIssue = async (req: Request, res: Response): Promise<void> => {
    try {
        const { issueId, assigneeId } = req.body;
        if (!issueId) {
            res.status(400).json({ status: false, message: 'Issue Id and User Id are required' });
            return;
        }

        const result = await assignIssueUseCaseOb.execute(issueId, assigneeId);
        if (!result) {
            res.status(404).json({ status: false, message: 'No issue found with this id' });
            return;
        }
        res.status(200).json({ status: true, message: 'Issue assigned successfully', data: result });
        return;

    } catch (err) {
        console.error('Internal server error while assigning issue', err);
        res.status(500).json({ status: false, message: 'Internal server error while assigning issue' });
        return;
    }
}

export const dragDropUpdate = async (req: Request, res: Response): Promise<void> => {

    try {

        const { prevContainerId, containerId, movedTaskId } = req.body;
        if (!containerId || !movedTaskId || !prevContainerId) {
            res.status(400).json({ status: false, message: 'prevContainerId, container id and movedTask id are required' });
            return;
        }

        const result = await dragDropUseCaseOb.execute(prevContainerId, containerId, movedTaskId);

        if (!result) {
            res.status(404).json({ status: false, message: 'Couldnt udpate dragged data.' });
            return;
        }

        res.status(200).json({ status: true, message: 'Task updated', result });

    } catch (err) {

        console.error('Internal server error while updating dragdrop data', err);
        res.status(500).json({ status: false, message: 'Internal server error while updating dragdrop data' });
        return;

    }
}


export const changeTaskStatus = async (req: Request, res: Response): Promise<void> => {

    try {

        const { taskId, status } = req.body;

        if (!taskId || !status) {
            res.status(400).json({ status: false, message: 'task id and status required' });
            return;
        }

        const result = await taskStatusChangeUseCaseOb.execute(taskId, status);
        if (!result) {
            throw new Error('Something went wront while updating task status ');
        }

        res.status(200).json({ status: true, message: 'Task updated', result });
        return;

    } catch (err) {
        console.error('Internal server error while updating task status', err);
        res.status(500).json({ status: false, message: 'Internal server error while updating task status' });
        return;
    }
}

export const startSprint = async (req: Request, res: Response): Promise<void> => {

    try {

        const { sprintId, sprintName, duration, startDate } = req.body;
        if (!sprintId || !sprintName || !duration || !startDate) {
            res.status(400).json({ status: false, message: 'sprint id, sprintname, duration and startdate are required' });
            return;
        }

        const result = await startSprintUsecaseOb.execute(sprintId, sprintName, duration, startDate);
        console.log(result,'He');
        if (!result) {
            throw new Error('Something went wrong while updating sprint.');
        }

        res.status(200).json({status:true, message : 'Sprint started successfully', result});
        return;

    } catch (err) {
        console.error('Internal server error while starting sprint', err);
        res.status(500).json({ status: false, message: 'Internal server error while starting sprint' });
        return;
    }
}