
import { DeepPopulatedTask, Task } from "../../../infrastructure/database/models/task.interface";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { Permissions } from "../../../infrastructure/database/models/role.interface";

export interface IUpdateBurnDownUseCase {
    execute(task: Task): Promise<boolean>;
}

export interface ISetSprintVelocityUsecase {
    execute(sprintId: string, projectId: string): Promise<boolean>;
}

export interface ISprintPointsCalculationUsecase {
    execute(sprintId: string): Promise<boolean>
}

export interface ICreateEpicUsecase {
    execute(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task>
}

export interface IRemoveTaskUsecase {
    execute(taskId: string): Promise<boolean>;
}

export interface IUpdateEpicUsecase {
    execute(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task>
}

export interface ICreateIssueUsecase {
    execute(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<Task>;
}

export interface ICreateSubTasksUsecase {
    execute(title: string, type: string, parentId: string, projectId: string): Promise<Task>;
}

export interface ICreateSprintUsecase {
    execute(projectId: string, sprintIds: Array<string>, userId: string): Promise<Sprint>;
}

export interface IGetSprintUsecase {
    execute(projectId: string, permissions: Array<Permissions>, userId: string, kanban: boolean): Promise<boolean | Sprint[]>
}

export interface IGetSprintWithIDUsecase {
    execute(sprintId: string): Promise<Sprint>;
}

export interface IGetAllSprintsDetailsInProject {
    execute(projectId: string): Promise<Array<Sprint>>;
}

export interface IGetSprintWithTasksUsecase {
    execute(sprintId: string): Promise<Sprint>;
}

export interface IGetTasksUsecase {
    execute(projectId: string, permissions: Array<Permissions>, userId: string, isKanban?: boolean): Promise<DeepPopulatedTask>;
}

export interface IAssignIssueUsecase {
    execute(issueId: string, userId: string): Promise<DeepPopulatedTask | null>;
}

export interface IDragDropUsecase {
    execute(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task>;
}

export interface IChangeTaskStatusUsecase {
    execute(taskId: string, status: string): Promise<Task | null>;
}

export interface IStartSprintUsecase {
    execute(
        sprintId: string,
        sprintName: string,
        duration: number,
        startDate: Date,
        goal: string,
        description: string,
        burnDownData: { date: Date; remainingPoints: number }[]
    ): Promise<any>;
}

export interface IIsActiveSprintUsecase {
    execute(projectId: string): Promise<Sprint | null>;
}