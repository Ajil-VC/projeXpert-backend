import { NextFunction, Request, Response } from "express";

import {
    IAssignIssue, IChangeTaskStatus,
    ICreateEpic, ICreateIssue, ICreateSprint, ICreateSubTasks, IDragDrop, IGetSprint, IGetSubtasks, IGetTasks, IIsActiveSprint, IRemoveTask, IStartSprint, IUpdateEpic
} from "../../config/Dependency/user/backlog.di";

import { IAddComment, ICanChangeStatus, ICompleteSprint, IEpicProgress, IGetComments, IGetTask, IRemoveAttachment, IUpdateTaskDetails } from "../../config/Dependency/user/task.di";

import { getIO } from "../../config/socket";
import { getUserSocket } from "../../infrastructure/services/socket.manager";
import { ICreateNotification } from "../../config/Dependency/user/notification.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IBacklogController } from "../../interfaces/user/backlog.controller.interface";
import { IAddActivity } from "../../config/Dependency/user/activity.di";
import { IGetTaskHistory, ITaskHistoryUsecase } from "../../config/Dependency/user/taskhistory.di";
import { Team } from "../../infrastructure/database/models/team.interface";
import { Permissions } from "../../infrastructure/database/models/role.interface";

export class BacklogController implements IBacklogController {


    constructor(
        private createEpicUsecase: ICreateEpic,
        private updateEpicUsecase: IUpdateEpic,
        private createIssueUsecase: ICreateIssue,
        private createSprintUsecase: ICreateSprint,
        private getSprintsUsecase: IGetSprint,
        private getTasksUsecase: IGetTasks,
        private assignIssueUsecase: IAssignIssue,
        private notification: ICreateNotification,
        private dragDropUsecase: IDragDrop,
        private updateTaskDetailsUse: IUpdateTaskDetails,
        private removeAttachment: IRemoveAttachment,
        private changeTaskStatusUsecase: IChangeTaskStatus,
        private startSprintUsecase: IStartSprint,
        private completeSprintUse: ICompleteSprint,
        private getCommentsUse: IGetComments,
        private addCommentUse: IAddComment,
        private epicProgress: IEpicProgress,
        private isActiveSprint: IIsActiveSprint,
        private addActivityUsecase: IAddActivity,
        private createSubtaskUsecase: ICreateSubTasks,
        private getSubtasksUsecase: IGetSubtasks,
        private removeTaskUsecase: IRemoveTask,
        private addTaskHistory: ITaskHistoryUsecase,
        private getTask: IGetTask,
        private getTaskHistory: IGetTaskHistory,
        private canChangeStatus: ICanChangeStatus

    ) { }

    taskHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            if (req.query.taskId === 'undefined' || !req.query.taskId || typeof req.query.taskId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false });
                return;
            }
            const taskId = req.query.taskId;
            const history = await this.getTaskHistory.execute(taskId);

            res.status(HttpStatusCode.OK).json({ status: true, result: history });
            return;

        } catch (err) {
            next(err);
        }
        throw new Error("Method not implemented.");
    }


    removeTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const taskId = req.params.taskId;

            const task = await this.getTask.execute(taskId);
            const result = await this.removeTaskUsecase.execute(taskId);

            this.addTaskHistory.execute(
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


    getSubtasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const parentId = req.params.parentId;
            const result = await this.getSubtasksUsecase.execute(parentId);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    createSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { title, parentId, projectId } = req.body;
            const type = 'subtask';
            const result = await this.createSubtaskUsecase.execute(title, type, parentId, projectId);

            await this.addTaskHistory.execute(
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

            const result = await this.updateEpicUsecase.execute(title, description, startDate, endDate, status, epicId);

            await this.addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, 'updated the epic', title);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    createEpic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { title, description, startDate, endDate, projectId } = req.body;
            const result = await this.createEpicUsecase.execute(title, description, startDate, endDate, projectId, req.user.id);
            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'created new epic', title);
            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }

    }

    createIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { projectId, issueType, issueName, taskGroup, epicId } = req.body;
            const result = await this.createIssueUsecase.execute(projectId, issueType, issueName, taskGroup, epicId);

            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, `created new ${issueType}`, issueName);

            if (result.epicId) {

                const epicId = typeof result.epicId === 'string' ? result.epicId : result.epicId?._id.toString();
                const updateEpicProgress = await this.epicProgress.execute(epicId);
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
            const result = await this.createSprintUsecase.execute(projectId, issueIds, req.user.id);

            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'created new', 'sprint');

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

            const result = await this.getSprintsUsecase.execute(projectId, permissions, userId, isKanbanRequest);

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
            const result = await this.getTasksUsecase.execute(projectId, req.user.role.permissions, req.user.id, isKanbanRequest);

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

            const result = await this.assignIssueUsecase.execute(issueId, assigneeId);
            if (result?.projectId) {

                await Promise.all([
                    this.addActivityUsecase.execute(result.projectId, req.user.companyId, req.user.id, 'changed assignee to', result?.assignedTo?.email || null),
                    this.addTaskHistory.execute({
                        taskId: issueId,
                        updatedBy: req.user.id,
                        actionType: 'ASSIGN',
                        assignedTo: assigneeId
                    })
                ]);
            }

            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No issue found with this id' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Issue reassigned successfully', data: result });
            if (assigneeId) {
                const createdNotification = await this.notification.execute(req.user.id, assigneeId, 'task', `You are assigned to a task by ${req.user.email}`, 'user/board');
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

            const result = await this.dragDropUsecase.execute(prevContainerId, containerId, movedTaskId);

            await this.addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `moved ${result.title} to`, containerId);
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

            const skipStatus: boolean = req.query.skipStatus === 'true' ? true : false;
            if (skipStatus) {
                const oldData = await this.getTask.execute(taskData._id);
                taskData.status = oldData.status;
            }

            const result = await this.updateTaskDetailsUse.execute(taskData, assigneeId, files);
            await Promise.all([
                this.addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `updated`, taskData.title),
                this.addTaskHistory.execute({
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
            const result = await this.removeAttachment.execute(publicId, taskId);

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


            const taskAndPermission = await this.canChangeStatus.execute(taskId, req.user.id, req.user.role.permissions);

            if (!taskAndPermission.canChange && taskAndPermission.notAssignee) {
                res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: 'You are not the assignee of this task.' });
                return;
            }

            if (!taskAndPermission.canChange) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Task is not in active sprint! Status cannot be changed.' });
                return;
            }

            const result = await this.changeTaskStatusUsecase.execute(taskId, status);
            if (!result) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Subtasks should be completed before moving the task to done' });
                return;
            }

            if (taskAndPermission.task.status !== status) {
                await Promise.all([
                    this.addActivityUsecase.execute(result.projectId as unknown as string, req.user.companyId, req.user.id, `updated ${result.title} status to`, status),
                    this.addTaskHistory.execute({
                        taskId: taskId,
                        updatedBy: req.user.id,
                        actionType: "STATUS_CHANGE",
                        oldStatus: taskAndPermission.task.status,
                        newStatus: status
                    })
                ])
            }
            if (result.epicId) {
                const epicId = typeof result.epicId === 'string' ? result.epicId : result.epicId?.toString();
                const updateEpicProgress = await this.epicProgress.execute(epicId);
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

            const isActiveSprint = await this.isActiveSprint.execute(projectId);
            if (isActiveSprint) {
                res.status(HttpStatusCode.CONFLICT).json({ status: false, message: 'Complete the active sprint before starting next.' });
                return;
            }

            const result = await this.startSprintUsecase.execute(sprintId, sprintName, duration, startDate);
            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'started sprint', sprintName)

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.SPRINT.STARTED, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    completeSprint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const { completingSprintId, movingSprintId, projectId } = req.body

            const result = await this.completeSprintUse.execute(completingSprintId, movingSprintId, projectId);
            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, 'completed last active', 'sprint')

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

            const result = await this.getCommentsUse.execute(taskId);
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

            const result = await this.addCommentUse.execute(req.user.id, taskId, content);
            await this.addActivityUsecase.execute(projectId, req.user.companyId, req.user.id, `added comment to`, taskId);
            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return

        } catch (err) {
            next(err);
        }
    }


}
