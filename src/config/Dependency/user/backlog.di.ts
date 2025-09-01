
import { Task } from "../../../infrastructure/database/models/task.interface";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { TaskResponseDetailedDTO } from "../../../dtos/task/taskResponseDTO";


export interface ICreateEpic {
    execute(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task>
}

export interface IRemoveTask {
    execute(taskId: string): Promise<boolean>;
}

export interface IUpdateEpic {
    execute(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task>
}

export interface ICreateIssue {
    execute(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<any>;
}

export interface ICreateSubTasks {
    execute(title: string, type: string, parentId: string, projectId: string): Promise<Task>;
}

export interface IGetSubtasks {
    execute(parentId: string): Promise<Task[]>;
}

export interface ICreateSprint {
    execute(projectId: string, sprintIds: Array<string>, userId: string): Promise<Sprint>;
}

export interface IGetSprint {
    execute(projectId: string, userRole: string, userId: string, kanban: boolean): Promise<any>
}

export interface IGetTasks {
    execute(projectId: string, userRole: string, userId: string, isKanban?: boolean): Promise<any>;
}

export interface IAssignIssue {
    execute(issueId: string, userId: string): Promise<TaskResponseDetailedDTO | null>;
}

export interface IDragDrop {
    execute(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task>;
}

export interface IChangeTaskStatus {
    execute(taskId: string, status: string): Promise<Task | null>;
}

export interface IStartSprint {
    execute(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<any>;
}

export interface IIsActiveSprint {
    execute(projectId: string): Promise<boolean>;
}