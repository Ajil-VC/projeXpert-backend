import { NextFunction, Request, Response } from "express";

import { createEpicUsecase, updateEpicUse } from "../../../config/Dependency/user/backlog.di";
import { createIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { createSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { getSprintsUsecase } from "../../../config/Dependency/user/backlog.di";
import { getTasksUsecase } from "../../../config/Dependency/user/backlog.di";
import { assignIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { dragDropUsecase } from "../../../config/Dependency/user/backlog.di";
import { changeTaskStatusUsecase } from "../../../config/Dependency/user/backlog.di";
import { startSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { addCommentUse, removeAttachment, updateTaskDetailsUse } from "../../../config/Dependency/user/task.di";
import { completeSprintUse } from "../../../config/Dependency/user/task.di";
import { getIO } from "../../../config/socket";
import { getUserSocket } from "../../../infrastructure/services/socket.manager";
import { notification } from "../../../config/Dependency/user/notification.di";

import { HttpStatusCode } from "../http-status.enum";
import { RESPONSE_MESSAGES } from "../response-messages.constant";

import { getCommentsUse } from "../../../config/Dependency/user/task.di";


export const createEpic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { title, description, startDate, endDate, projectId } = req.body;
        const result = await createEpicUsecase.execute(title, description, startDate, endDate, projectId, req.user.id);

        res.status(HttpStatusCode.CREATED).json({ status: true, result });
        return;

    } catch (err) {

        next(err);
    }
}

export const updateEpic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { title, description, startDate, endDate, epicId } = req.body;
        const result = await updateEpicUse.execute(title, description, startDate, endDate, epicId);

        res.status(HttpStatusCode.OK).json({ status: true, result });
        return;

    } catch (err) {

        next(err);
    }
}

export const createIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { projectId, issueType, issueName, taskGroup, epicId } = req.body;
        const result = await createIssueUsecase.execute(projectId, issueType, issueName, taskGroup, epicId);

        res.status(HttpStatusCode.CREATED).json({ status: true, result });
        return;

    } catch (err) {

        next(err);
    }
}

export const createSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const { projectId, issueIds } = req.body;
        const result = await createSprintUsecase.execute(projectId, issueIds, req.user.id);

        res.status(HttpStatusCode.CREATED).json({ status: true, result, message: RESPONSE_MESSAGES.SPRINT.CREATED });
        return;

    } catch (err) {
        next(err);
    }
}

export const getSprints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const projectId = req.params.projectId;
        if (typeof projectId !== 'string') throw new Error('Project id is not valid string');
        const userRole = req.user.role;
        const userId = req.user.id;
        //THIs controller is for returning all the sprints in the project.

        //In this section  im sending the active and completed sprint data.
        const isKanbanRequest = req.path.startsWith('/get-sprints/kanban');

        const result = await getSprintsUsecase.execute(projectId, userRole, userId, isKanbanRequest);

        res.status(HttpStatusCode.OK).json({ status: true, result });
        return;

    } catch (err) {
        next(err);
    }
}




export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const projectId = req.query.projectId;

        if (typeof projectId !== 'string') throw new Error('Project id is not valid string');

        //Using this variable to retrieve all the assigned tasks to send to kanban
        const isKanbanRequest = req.path.startsWith('/tasks/kanban');
        const result = await getTasksUsecase.execute(projectId, req.user.role, req.user.id, isKanbanRequest);

        res.status(HttpStatusCode.OK).json({ status: true, result });
        return;

    } catch (err) {
        next(err);
    }
}


export const assignIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const io = getIO();

        const { issueId, assigneeId } = req.body;

        if (!issueId) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Issue Id and User Id are required' });
            return;
        }

        const result = await assignIssueUsecase.execute(issueId, assigneeId);

        if (!result) {
            res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No issue found with this id' });
            return;
        }


        res.status(HttpStatusCode.OK).json({ status: true, message: 'Issue assigned successfully', data: result });
        if (assigneeId) {
            const createdNotification = await notification.execute(req.user.id, assigneeId, 'task', `You are assigned to a task by ${req.user.email}`, 'user/board');
            const assigneeSocketId = getUserSocket(assigneeId);
            if (assigneeSocketId) {
                io.to(assigneeSocketId).emit('notification', createdNotification)
            }
        }
        return;

    } catch (err) {
        next(err);
    }
}

export const dragDropUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { prevContainerId, containerId, movedTaskId } = req.body;
        if (!containerId || !movedTaskId || !prevContainerId) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'prevContainerId, container id and movedTask id are required' });
            return;
        }

        const result = await dragDropUsecase.execute(prevContainerId, containerId, movedTaskId);

        res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.TASK.UPDATED, result });

    } catch (err) {

        next(err);

    }
}

export const updateTaskDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const assigneeId = req.body.assigningUserId;
        const taskData = JSON.parse(req.body.task);
        const files = req.files as Express.Multer.File[] || [];

        const result = await updateTaskDetailsUse.execute(taskData, assigneeId, files);

        res.status(HttpStatusCode.OK).json({ status: false, message: RESPONSE_MESSAGES.TASK.UPDATED, result });
        return;

    } catch (err) {

        next(err);
    }
}

export const deleteCloudinaryAttachment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const publicId = req.query.publicId;
        const taskId = req.query.taskId;
        if (!publicId || !taskId) {
            throw new Error('Publicid or taskId is undefined.');
        }
        if (typeof publicId !== 'string' || typeof taskId !== 'string') {
            throw new Error('Publicid or taskId is not a valid string.');
        }
        const result = await removeAttachment.execute(publicId, taskId);

        res.status(HttpStatusCode.OK).json({ status: true, message: 'Attachment removed successfully.', result });
        return;

    } catch (err) {
        next(err);
    }
}


export const changeTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { taskId, status } = req.body;

        if (!taskId || !status) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'task id and status required' });
            return;
        }

        const result = await changeTaskStatusUsecase.execute(taskId, status);

        res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.TASK.UPDATED, result });
        return;

    } catch (err) {
        next(err);
    }
}

export const startSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { sprintId, sprintName, duration, startDate } = req.body;
        if (!sprintId || !sprintName || !duration || !startDate) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'sprint id, sprintname, duration and startdate are required' });
            return;
        }

        const result = await startSprintUsecase.execute(sprintId, sprintName, duration, startDate);

        res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.SPRINT.STARTED, result });
        return;

    } catch (err) {

        next(err);
    }
}


export const completeSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const { completingSprintId, movingSprintId, projectId } = req.body

        const result = await completeSprintUse.execute(completingSprintId, movingSprintId, projectId);

        res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.SPRINT.UPDATED, result });
        return;

    } catch (err) {

        next(err);

    }
}


export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const taskId = req.query.task_id as string;

        if (!taskId) throw new Error('Project Id and task Id cannot be null');

        const result = await getCommentsUse.execute(taskId);
        res.status(HttpStatusCode.OK).json({ status: true, result });
        return;

    } catch (err) {

        next(err);
    }
}

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { taskId, content } = req.body;
        if (!taskId || !content) {
            throw new Error('Task ID or content cannot be null');
        }

        const result = await addCommentUse.execute(req.user.id, taskId, content);
        res.status(HttpStatusCode.CREATED).json({ status: true, result });
        return

    } catch (err) {
        next(err);
    }
}