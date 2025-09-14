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
import {
    IAssignIssueUsecase, IChangeTaskStatusUsecase, ICreateEpicUsecase, ICreateIssueUsecase,
    ICreateSprintUsecase, ICreateSubTasksUsecase, IDragDropUsecase, IGetSprintUsecase, IGetTasksUsecase,
    IIsActiveSprintUsecase, IRemoveTaskUsecase, IStartSprintUsecase, IUpdateEpicUsecase
} from "../../../config/Dependency/user/backlog.di";

import { notification } from "./notification.inter";
import { CreateSubTaskUsecase } from "../../../application/usecase/backlogUseCase/createSubtask.usecase";
import { RemoveTaskUsecase } from "../../../application/usecase/backlogUseCase/removetask.usecase";
import { IGetTaskHistoryUsecase, ITaskHistoryUsecase } from "../../../config/Dependency/user/taskhistory.di";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";
import { TaskHistoryRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/taskhistory.repositoryImp";
import { TaskHistoryUsecase } from "../../../application/usecase/taskhistoryUsecase/taskhistory.usecase";
import { ICanChangeStatusUsecase, IGetTaskUsecase } from "../../../config/Dependency/user/task.di";
import { TaskRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/task.repositoryImp";
import { GetTask } from "../../../application/usecase/taskUsecase/getTask.usecase";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { GetTaskHistory } from "../../../application/usecase/taskhistoryUsecase/gettaskhistory.usecase";
import { CanChangeTaskStatus } from "../../../application/usecase/taskUsecase/canchangestatus.usecase";

const backlogRepository: IBacklogRepository = new BacklogRepositoryImp();

export const createEpicUsecase: ICreateEpicUsecase = new CreateEpicUsecase(backlogRepository);
export const updateEpicUse: IUpdateEpicUsecase = new UpdateEpicUsecase(backlogRepository);
export const createIssueUsecase: ICreateIssueUsecase = new CreateIssueUsecase(backlogRepository);
export const createSprintUsecase: ICreateSprintUsecase = new CreateSprintUsecase(backlogRepository);
export const getSprintsUsecase: IGetSprintUsecase = new GetSprintsUseCase(backlogRepository);
export const getTasksUsecase: IGetTasksUsecase = new GetTasksUseCase(backlogRepository);
export const assignIssueUsecase: IAssignIssueUsecase = new AssignIssueUseCase(backlogRepository);
export const dragDropUsecase: IDragDropUsecase = new DragDropUseCase(backlogRepository);
export const changeTaskStatusUsecase: IChangeTaskStatusUsecase = new ChangeTaskStatus(backlogRepository);
export const startSprintUsecase: IStartSprintUsecase = new StartSprintUsecase(backlogRepository);
export const isActiveSprint: IIsActiveSprintUsecase = new IsActiveSprintUsecase(backlogRepository);
export const createSubtaskUsecase: ICreateSubTasksUsecase = new CreateSubTaskUsecase(backlogRepository);
export const removeTaskUsecase: IRemoveTaskUsecase = new RemoveTaskUsecase(backlogRepository);

const taskHistoryRepository: ITaskHistoryRepository = new TaskHistoryRepositoryImp();
export const addTaskHistoryUse: ITaskHistoryUsecase = new TaskHistoryUsecase(taskHistoryRepository);
export const taskHistoryUsecase: IGetTaskHistoryUsecase = new GetTaskHistory(taskHistoryRepository);
const taskRepository: ITaskRepository = new TaskRepositoryImp();
export const getTaskUse: IGetTaskUsecase = new GetTask(taskRepository);
export const canChangeTaskStatus: ICanChangeStatusUsecase = new CanChangeTaskStatus(taskRepository);

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
    removeTaskUsecase,
    addTaskHistoryUse,
    getTaskUse,
    taskHistoryUsecase,
    canChangeTaskStatus
)