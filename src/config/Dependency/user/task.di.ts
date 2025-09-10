
import { Permissions } from "../../../infrastructure/database/models/role.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";


export interface IUpdateTaskDetails {
    execute(task: Task, assigneeId: string, files: Express.Multer.File[]): Promise<Task>
}

export interface IRemoveAttachment {
    execute(publicId: string, taskId: string): Promise<Task>;
}

export interface ICompleteSprint {
    execute(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task>>;
}

export interface IGetComments {
    execute(taskId: string): Promise<Comment[]>;
}

export interface IAddComment {
    execute(userId: string, taskId: string, content: string): Promise<Comment>;
}

export interface IEpicProgress {
    execute(epicId: string): Promise<Task>;
}

export interface IGetTask {
    execute(taskId: string): Promise<Task>;
}

export interface ICanChangeStatus {
    execute(taskId: string, userId: string, permissions: Array<Permissions>): Promise<{ task: Task, canChange: boolean, notAssignee?: boolean }>;
}