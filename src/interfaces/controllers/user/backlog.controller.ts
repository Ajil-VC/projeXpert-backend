import { Request, Response } from "express";

import { createEpicUsecase } from "../../../config/Dependency/user/backlog.di";
import { createIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { createSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { getSprintsUsecase } from "../../../config/Dependency/user/backlog.di";
import { getTasksUsecase } from "../../../config/Dependency/user/backlog.di";
import { assignIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { dragDropUsecase } from "../../../config/Dependency/user/backlog.di";
import { changeTaskStatusUsecase } from "../../../config/Dependency/user/backlog.di";
import { startSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { updateTaskDetailsUse } from "../../../config/Dependency/user/task.di";
import { completeSprintUse } from "../../../config/Dependency/user/task.di";
import { getIO } from "../../../config/socket";
import { getUserSocket } from "../../../infrastructure/services/socket.manager";
import { notification } from "../../../config/Dependency/user/notification.di";

export const createEpic = async (req: Request, res: Response): Promise<void> => {

    try {

        const { epicName, projectId } = req.body;
        const result = await createEpicUsecase.execute(epicName, projectId);
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
        const result = await createIssueUsecase.execute(projectId, issueType, issueName, taskGroup, epicId);

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
        const result = await createSprintUsecase.execute(projectId, issueIds, req.user.id);

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
        const userRole = req.user.role;
        const userId = req.user.id;
        //THIs controller is for returning all the sprints in the project.

        //In this section  im sending the active and completed sprint data.
        const isKanbanRequest = req.path.startsWith('/get-sprints/kanban');

        const result = await getSprintsUsecase.execute(projectId, userRole, userId, isKanbanRequest);
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

        //Using this variable to retrieve all the assigned tasks to send to kanban
        const isKanbanRequest = req.path.startsWith('/tasks/kanban');
        const result = await getTasksUsecase.execute(projectId, req.user.role, req.user.id, isKanbanRequest);

        res.status(200).json({ status: true, result });
        return;

    } catch (err) {
        console.error('Something went wrong while getting tasks', err);
        res.status(500).json({ status: false, message: 'Something went wrong while getting tasks' });
    }
}


export const assignIssue = async (req: Request, res: Response): Promise<void> => {
    try {

        const io = getIO();

        const { issueId, assigneeId } = req.body;

        if (!issueId) {
            res.status(400).json({ status: false, message: 'Issue Id and User Id are required' });
            return;
        }

        const result = await assignIssueUsecase.execute(issueId, assigneeId);

        if (!result) {
            res.status(404).json({ status: false, message: 'No issue found with this id' });
            return;
        }


        res.status(200).json({ status: true, message: 'Issue assigned successfully', data: result });
        if (assigneeId) {
            const createdNotification = await notification.execute(req.user.id, assigneeId, 'task', `You are assigned to a task by ${req.user.email}`, '');
            const assigneeSocketId = getUserSocket(assigneeId);
            if (assigneeSocketId) {
                io.to(assigneeSocketId).emit('notification', createdNotification)
            }
        }
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

        const result = await dragDropUsecase.execute(prevContainerId, containerId, movedTaskId);

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

export const updateTaskDetails = async (req: Request, res: Response): Promise<void> => {

    try {

        const { taskData, assigneeId } = req.body;
        console.log(taskData, assigneeId);

        const result = await updateTaskDetailsUse.execute(taskData, assigneeId);
        if (!result) {
            throw new Error('Couldnt update task details.');
        }

        res.status(200).json({ status: false, message: 'Task details updated', result });
        return;

    } catch (err) {

        console.error('Internal server error while updating task details', err);
        res.status(500).json({ status: false, message: 'Internal server error while updating task details' });
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

        const result = await changeTaskStatusUsecase.execute(taskId, status);
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

        const result = await startSprintUsecase.execute(sprintId, sprintName, duration, startDate);
        console.log(result, 'He');
        if (!result) {
            throw new Error('Something went wrong while updating sprint.');
        }

        res.status(200).json({ status: true, message: 'Sprint started successfully', result });
        return;

    } catch (err) {
        console.error('Internal server error while starting sprint', err);
        res.status(500).json({ status: false, message: 'Internal server error while starting sprint' });
        return;
    }
}


export const completeSprint = async (req: Request, res: Response): Promise<void> => {

    try {
        const { completingSprintId, movingSprintId, projectId } = req.body

        const result = await completeSprintUse.execute(completingSprintId, movingSprintId, projectId);
        if (!result) {
            throw new Error('Sprint couldnt complete.');
        }
        res.status(200).json({ status: true, message: "Sprint completed.", result });
        return;

    } catch (err) {

        console.error('Internal server error while completing sprint', err);
        res.status(500).json({ status: false, message: 'Internal server error while completing sprint' });
        return;

    }
}