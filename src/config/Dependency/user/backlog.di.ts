
import { Task } from "../../../infrastructure/database/models/task.interface";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { TaskResponseDetailedDTO } from "../../../dtos/task/taskResponseDTO";
import { Permissions } from "../../../infrastructure/database/models/role.interface";


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
    execute(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<any>;
}

export interface ICreateSubTasksUsecase {
    execute(title: string, type: string, parentId: string, projectId: string): Promise<Task>;
}

export interface ICreateSprintUsecase {
    execute(projectId: string, sprintIds: Array<string>, userId: string): Promise<Sprint>;
}

export interface IGetSprintUsecase {
    execute(projectId: string, permissions: Array<Permissions>, userId: string, kanban: boolean): Promise<any>
}

export interface IGetSprintWithIDUsecase {
    execute(sprintId: string): Promise<Sprint>;
}

export interface IGetCompletedSprintsUsecase {
    execute(projectId: string): Promise<Array<Sprint>>;
}

export interface IGetTasksInSprintUsecase {
    execute(sprintId: string): Promise<Array<Task>>;
}

export interface IGetTasksUsecase {
    execute(projectId: string, permissions: Array<Permissions>, userId: string, isKanban?: boolean): Promise<any>;
}

export interface IAssignIssueUsecase {
    execute(issueId: string, userId: string): Promise<TaskResponseDetailedDTO | null>;
}

export interface IDragDropUsecase {
    execute(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task>;
}

export interface IChangeTaskStatusUsecase {
    execute(taskId: string, status: string): Promise<Task | null>;
}

export interface IStartSprintUsecase {
    execute(sprintId: string, sprintName: string, duration: number, startDate: Date, goal: string, description: string): Promise<any>;
}

export interface IIsActiveSprintUsecase {
    execute(projectId: string): Promise<boolean>;
}