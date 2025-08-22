import { CreateEpicUsecase } from "../../../application/usecase/backlogUseCase/createEpic.usecase";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";
import { CreateIssueUsecase } from "../../../application/usecase/backlogUseCase/createIssue.usecase";
import { AssignIssueUseCase } from "../../../application/usecase/backlogUseCase/assignIssue.usecase";
import { CreateSprintUsecase } from "../../../application/usecase/backlogUseCase/createSprint.usecase";
import { GetSprintsUseCase } from "../../../application/usecase/backlogUseCase/getSprint.usecase";
import { DragDropUseCase } from "../../../application/usecase/backlogUseCase/dragDrop.usecase";
import { ChangeTaskStatus } from "../../../application/usecase/backlogUseCase/changeTaskStatus.usecase";
import { StartSprintUsecase } from "../../../application/usecase/backlogUseCase/startSprint.usecase";
import { UpdateEpicUsecase } from "../../../application/usecase/backlogUseCase/updateEpic.usecase";
import { IsActiveSprintUsecase } from "../../../application/usecase/backlogUseCase/isActiveSprint.usecase";

import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { BacklogRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/backlog.repositoryImp";
import { BacklogController } from "../../../controllers/user/backlog.controller";
import { IBacklogController } from "../../../interfaces/user/backlog.controller.interface";
import { addActivityUsecase } from "../user.di";
import { addCommentUse, completeSprintUse, epicProgress, getCommentsUse, removeAttachment, updateTaskDetailsUse } from "./task.inter";
import { IAssignIssue, IChangeTaskStatus, ICreateEpic, ICreateIssue, ICreateSprint, ICreateSubTasks, IDragDrop, IGetSprint, IGetSubtasks, IGetTasks, IIsActiveSprint, IRemoveTask, IStartSprint, IUpdateEpic } from "../../../config/Dependency/user/backlog.di";

import { getNotificationsUse, notification, readNotifications } from "./notification.inter";
import { CreateSubTaskUsecase } from "../../../application/usecase/backlogUseCase/createSubtask.usecase";
import { GetSubtasksUsecase } from "../../../application/usecase/backlogUseCase/getsubtasks..usecase";
import { RemoveTaskUsecase } from "../../../application/usecase/backlogUseCase/removetask.usecase";

const backlogRepository: IBacklogRepository = new BacklogRepositoryImp();

export const createEpicUsecase: ICreateEpic = new CreateEpicUsecase(backlogRepository);
export const updateEpicUse: IUpdateEpic = new UpdateEpicUsecase(backlogRepository);
export const createIssueUsecase: ICreateIssue = new CreateIssueUsecase(backlogRepository);
export const createSprintUsecase: ICreateSprint = new CreateSprintUsecase(backlogRepository);
export const getSprintsUsecase: IGetSprint = new GetSprintsUseCase(backlogRepository);
export const getTasksUsecase: IGetTasks = new GetTasksUseCase(backlogRepository);
export const assignIssueUsecase: IAssignIssue = new AssignIssueUseCase(backlogRepository);
export const dragDropUsecase: IDragDrop = new DragDropUseCase(backlogRepository);
export const changeTaskStatusUsecase: IChangeTaskStatus = new ChangeTaskStatus(backlogRepository);
export const startSprintUsecase: IStartSprint = new StartSprintUsecase(backlogRepository);
export const isActiveSprint: IIsActiveSprint = new IsActiveSprintUsecase(backlogRepository);
export const createSubtaskUsecase: ICreateSubTasks = new CreateSubTaskUsecase(backlogRepository);
export const getSubtasksUsecase: IGetSubtasks = new GetSubtasksUsecase(backlogRepository);
export const removeTaskUsecase: IRemoveTask = new RemoveTaskUsecase(backlogRepository);

export const backlogControllerInterface: IBacklogController = new BacklogController(
    createEpicUsecase,
    updateEpicUse,
    createIssueUsecase,
    createSprintUsecase,
    getSprintsUsecase,
    getTasksUsecase,
    assignIssueUsecase,
    notification,
    dragDropUsecase,
    updateTaskDetailsUse,
    removeAttachment,
    changeTaskStatusUsecase,
    startSprintUsecase,
    completeSprintUse,
    getCommentsUse,
    addCommentUse,
    epicProgress,
    isActiveSprint,
    addActivityUsecase,
    createSubtaskUsecase,
    getSubtasksUsecase,
    removeTaskUsecase
)