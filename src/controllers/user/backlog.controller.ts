import { NextFunction, Request, Response } from "express";

import {
    IAssignIssueUsecase, IChangeTaskStatusUsecase,
    ICreateEpicUsecase, ICreateIssueUsecase, ICreateSprintUsecase, ICreateSubTasksUsecase,
    IDragDropUsecase, IGetCompletedSprintsUsecase, IGetSprintUsecase, IGetTasksInSprintUsecase, IGetTasksUsecase, IIsActiveSprintUsecase, IRemoveTaskUsecase, IStartSprintUsecase, IUpdateEpicUsecase
} from "../../config/Dependency/user/backlog.di";

import {
    IAddCommentUsecase, ICanChangeStatusUsecase, ICompleteSprintUsecase, IEpicProgressUsecase,
    IGetCommentsUsecase, IGetTaskUsecase, IRemoveAttachmentUsecase, ISetStoryPointUsecase, IUpdateTaskDetailsUsecase
} from "../../config/Dependency/user/task.di";

import { getIO } from "../../config/socket";
import { getUserSocket } from "../../infrastructure/services/socket.manager";
import { ICreateNotificationUsecase } from "../../config/Dependency/user/notification.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IBacklogController } from "../../interfaces/user/backlog.controller.interface";
import { IAddActivityUsecase } from "../../config/Dependency/user/activity.di";
import { IGetTaskHistoryUsecase, ITaskHistoryUsecase } from "../../config/Dependency/user/taskhistory.di";
import { Permissions } from "../../infrastructure/database/models/role.interface";
import { Sprint } from "../../infrastructure/database/models/sprint.interface";

export class BacklogController implements IBacklogController {


    constructor(
        private _createEpicUsecase: ICreateEpicUsecase,
        private _updateEpicUsecase: IUpdateEpicUsecase,
        private _createIssueUsecase: ICreateIssueUsecase,
        private _createSprintUsecase: ICreateSprintUsecase,
        private _getSprintsUsecase: IGetSprintUsecase,
        private _getTasksUsecase: IGetTasksUsecase,
        private _assignIssueUsecase: IAssignIssueUsecase,
        private _notification: ICreateNotificationUsecase,
        private _dragDropUsecase: IDragDropUsecase,
        private _updateTaskDetailsUse: IUpdateTaskDetailsUsecase,
        private _removeAttachment: IRemoveAttachmentUsecase,
        private _changeTaskStatusUsecase: IChangeTaskStatusUsecase,
        private _startSprintUsecase: IStartSprintUsecase,
        private _completeSprintUse: ICompleteSprintUsecase,
        private _getCommentsUse: IGetCommentsUsecase,
        private _addCommentUse: IAddCommentUsecase,
        private _epicProgress: IEpicProgressUsecase,
        private _isActiveSprint: IIsActiveSprintUsecase,
        private _addActivityUsecase: IAddActivityUsecase,
        private _createSubtaskUsecase: ICreateSubTasksUsecase,
        private _removeTaskUsecase: IRemoveTaskUsecase,
        private _addTaskHistory: ITaskHistoryUsecase,
        private _getTask: IGetTaskUsecase,
        private _getTaskHistory: IGetTaskHistoryUsecase,
        private _canChangeStatus: ICanChangeStatusUsecase,
        private _setStoryPoint: ISetStoryPointUsecase,
        private _getCompletedSprintDetails: IGetCompletedSprintsUsecase,
        private _getTasksInSprint: IGetTasksInSprintUsecase,

    ) { }

    getTasksInSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const sprintId = req.params.sprintId;
            if (!sprintId || typeof sprintId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Need valid sprint Id.' });
                return;
            }

            const tasks = await this._getTasksInSprint.execute(sprintId);
            res.status(HttpStatusCode.OK).json({ status: true, message: 'Tasks in sprint retrieved successfully.', result: tasks });
            return;
        } catch (err) {
            next(err);
        }
    }


    getCompletedSprintDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.projectId;
            if (!projectId || typeof projectId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Need valid project Id.' });
                return;
            }

            const sprints = await this._getCompletedSprintDetails.execute(projectId);
            res.status(HttpStatusCode.OK).json({ status: true, message: 'Sprint data successfully retrieved.', result: sprints });
            return;

        } catch (err) {
            next(err);
        }
    }


    setStoryPoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { storyPoints, taskId } = req.body;

            const updatedTask = await this._setStoryPoint.execute(storyPoints, taskId);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Story point set successfully.', result: updatedTask });
            return;

        } catch (err) {

            next(err);
        }
    }

    taskHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            if (req.query.taskId === 'undefined' || !req.query.taskId || typeof req.query.taskId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false });
                return;
            }
            const taskId = req.query.taskId;
            const history = await this._getTaskHistory.execute(taskId);

            res.status(HttpStatusCode.OK).json({ status: true, result: history });
            return;

        } catch (err) {
            next(err);
        }

    }


    removeTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const taskId = req.params.taskId;

            const task = await this._getTask.execute(taskId);
            const result = await this._removeTaskUsecase.execute(taskId);

            this._addTaskHistory.execute(
                {
                    taskId: task.parentId as unknown as string,
                    updatedBy: req.user.id,
                    actionType: 'DELETE_SUBTASK',
                    subtaskId: task._id as unknown as string,
                    subtaskTitle: task.title,
                    assignedTo: task.assignedTo as unknown as string
                }
            )


            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true });
            return;

        } catch (err) {
            next(err);
        }
    }



    createSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { title, parentId, projectId } = req.body;
            const type = 'subtask';
            const result = await this._createSubtaskUsecase.execute(title, type, parentId, projectId);

            await this._addTaskHistory.execute(
                {
                    taskId: result.parentId as unknown as string,
                    updatedBy: req.user.id,
                    actionType: 'CREATE_SUBTASK',
                    subtaskTitle: result.title,
                    subtaskId: result._id as unknown as string
                }
            );

            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    updateEpic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { title, description, startDate, endDate, status, epicId } = req.body;

            const result = await this._updateEpicUsecase.execute(title, description, startDate, endDate, status, epicId);

            await this._addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, 'updated the epic', title);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    createEpic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { title, description, startDate, endDate, projectId } = req.body;
            const result = await this._createEpicUsecase.execute(title, description, startDate, endDate, projectId, req.user.id);
            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'created new epic', title);
            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }

    }

    createIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { projectId, issueType, issueName, taskGroup, epicId } = req.body;
            const result = await this._createIssueUsecase.execute(projectId, issueType, issueName, taskGroup, epicId);

            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, `created new ${issueType}`, issueName);

            if (result.epicId) {

                const epicId = typeof result.epicId === 'string' ? result.epicId : result.epicId?._id.toString();
                const updateEpicProgress = await this._epicProgress.execute(epicId);
            }


            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    createSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { projectId, issueIds } = req.body;
            const result = await this._createSprintUsecase.execute(projectId, issueIds, req.user.id);

            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'created new', 'sprint');

            res.status(HttpStatusCode.CREATED).json({ status: true, result, message: RESPONSE_MESSAGES.SPRINT.CREATED });
            return;

        } catch (err) {
            next(err);
        }
    }

    getSprints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const projectId = req.params.projectId;
            if (typeof projectId !== 'string') throw new Error('Project id is not valid string');
            const permissions = req.user.role.permissions as Array<Permissions>;
            const userId = req.user.id;
            //THIs controller is for returning all the sprints in the project.

            //In this section  im sending the active and completed sprint data.
            const isKanbanRequest = req.path.startsWith('/sprints/kanban');

            const result = await this._getSprintsUsecase.execute(projectId, permissions, userId, isKanbanRequest);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.projectId;

            if (typeof projectId !== 'string') throw new Error('Project id is not valid string');

            //Using this variable to retrieve all the assigned tasks to send to kanban
            const isKanbanRequest = req.path.startsWith('/tasks/kanban');
            const result = await this._getTasksUsecase.execute(projectId, req.user.role.permissions, req.user.id, isKanbanRequest);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    assignIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const io = getIO();

            const { issueId, assigneeId } = req.body;

            if (!issueId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Issue Id and User Id are required' });
                return;
            }

            const result = await this._assignIssueUsecase.execute(issueId, assigneeId);
            if (result?.projectId) {

                const taskIdToAddHistory = result.parentId ? result.parentId : issueId;
                const subtaskName = result.parentId ? result.title : undefined;

                await Promise.all([
                    this._addActivityUsecase.execute(result.projectId, req.user.companyId, req.user.id, 'changed assignee to', result?.assignedTo?.email || null),
                    this._addTaskHistory.execute({
                        taskId: taskIdToAddHistory,
                        updatedBy: req.user.id,
                        actionType: 'ASSIGN',
                        assignedTo: assigneeId,
                        subtaskTitle: subtaskName
                    })
                ]);
            }

            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No issue found with this id' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Issue reassigned successfully', data: result });
            if (assigneeId) {
                const createdNotification = await this._notification.execute(req.user.id, assigneeId, 'task', `You are assigned to a task by ${req.user.email}`, 'user/board');
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

    dragDropUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { prevContainerId, containerId, movedTaskId } = req.body;
            if (!containerId || !movedTaskId || !prevContainerId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'prevContainerId, container id and movedTask id are required' });
                return;
            }

            const result = await this._dragDropUsecase.execute(prevContainerId, containerId, movedTaskId);
            let container = 'backlog';
            if (result.sprintId && typeof result.sprintId !== 'string') {
                container = (result.sprintId as Sprint).name;
            }
            await this._addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `moved ${result.title} to`, container);
            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.TASK.UPDATED, result });

        } catch (err) {

            next(err);

        }
    }


    updateTaskDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const assigneeId = req.body.assigningUserId;
            const taskData = JSON.parse(req.body.task);
            const files = req.files as Express.Multer.File[] || [];

            if (taskData?.sprintId && taskData.sprintId.status && taskData.sprintId.status === 'completed') {
                res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: 'Tasks under completed sprint cannot be updated!' });
                return;
            }

            const skipStatus: boolean = req.query.skipStatus === 'true' ? true : false;
            if (skipStatus) {
                const oldData = await this._getTask.execute(taskData._id);
                taskData.status = oldData.status;
            }

            const result = await this._updateTaskDetailsUse.execute(taskData, assigneeId, files);
            await Promise.all([
                this._addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `updated`, taskData.title),
                this._addTaskHistory.execute({
                    taskId: taskData._id,
                    updatedBy: req.user.id,
                    actionType: 'UPDATED'
                })
            ]);


            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.TASK.UPDATED, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    deleteCloudinaryAttachment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const publicId = req.query.publicId;
            const taskId = req.query.taskId;
            if (!publicId || !taskId) {
                throw new Error('Publicid or taskId is undefined.');
            }
            if (typeof publicId !== 'string' || typeof taskId !== 'string') {
                throw new Error('Publicid or taskId is not a valid string.');
            }
            const result = await this._removeAttachment.execute(publicId, taskId);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Attachment removed successfully.', result });
            return;

        } catch (err) {
            next(err);
        }
    }


    changeTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { taskId, status } = req.body;

            if (!taskId || !status) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'task id and status required' });
                return;
            }


            const taskAndPermission = await this._canChangeStatus.execute(taskId, req.user.id, req.user.role.permissions);

            if (!taskAndPermission.canChange && taskAndPermission.notAssignee) {
                res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: 'You are not the assignee of this task.' });
                return;
            }

            if (!taskAndPermission.canChange && !taskAndPermission.task.parentId && taskAndPermission.task.subtasks.length > 0) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'This task status will be updated according to the subtasks.' });
                return;
            }

            if (!taskAndPermission.canChange) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Task is not in active sprint! Status cannot be changed.' });
                return;
            }


            const result = await this._changeTaskStatusUsecase.execute(taskId, status);
            if (!result) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Subtasks should be completed before moving the task to done' });
                return;
            }

            const subtaskName = taskAndPermission.task.parentId ? taskAndPermission.task.title : undefined;
            const taskIdToAddHistory = taskAndPermission.task.parentId ? taskAndPermission.task.parentId : taskId;
            if (taskAndPermission.task.status !== status) {
                await Promise.all([
                    this._addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `updated ${result.title} status to`, status),
                    this._addTaskHistory.execute({
                        taskId: taskIdToAddHistory,
                        updatedBy: req.user.id,
                        actionType: "STATUS_CHANGE",
                        oldStatus: taskAndPermission.task.status,
                        newStatus: status,
                        subtaskTitle: subtaskName
                    })
                ])
            }
            if (result.epicId) {
                const epicId = typeof result.epicId === 'string' ? result.epicId : result.epicId?.toString();
                const updateEpicProgress = await this._epicProgress.execute(epicId);
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.TASK.UPDATED, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    startSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { sprintId, sprintName, duration, startDate, projectId } = req.body;
            if (!sprintId || !sprintName || !duration || !startDate) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'sprint id, sprintname, duration and startdate are required' });
                return;
            }

            const isActiveSprint = await this._isActiveSprint.execute(projectId);
            if (isActiveSprint) {
                res.status(HttpStatusCode.CONFLICT).json({ status: false, message: 'Complete the active sprint before starting next.' });
                return;
            }

            const result = await this._startSprintUsecase.execute(sprintId, sprintName, duration, startDate);
            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'started sprint', sprintName)

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.SPRINT.STARTED, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    completeSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { completingSprintId, movingSprintId, projectId } = req.body

            const result = await this._completeSprintUse.execute(completingSprintId, movingSprintId, projectId);
            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'completed last active', 'sprint')

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.SPRINT.UPDATED, result });
            return;

        } catch (err) {

            next(err);

        }
    }

    getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const taskId = req.query.task_id as string;

            if (!taskId) throw new Error('Project Id and task Id cannot be null');

            const result = await this._getCommentsUse.execute(taskId);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }


    addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { taskId, content, projectId } = req.body;
            if (!taskId || !content) {
                throw new Error('Task ID or content cannot be null');
            }

            const result = await this._addCommentUse.execute(req.user.id, taskId, content);
            await this._addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, `added comment to`, taskId);
            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return

        } catch (err) {
            next(err);
        }
    }


}
