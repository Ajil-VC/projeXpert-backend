
import { Permissions } from "../../../infrastructure/database/models/role.interface";
import { StoryPoint, Task } from "../../../infrastructure/database/models/task.interface";


export interface IUpdateTaskDetailsUsecase {
    execute(task: Task, assigneeId: string, files: Express.Multer.File[]): Promise<Task>
}

export interface IRemoveAttachmentUsecase {
    execute(publicId: string, taskId: string): Promise<Task>;
}

export interface ICompleteSprintUsecase {
    execute(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task>>;
}

export interface IGetCommentsUsecase {
    execute(taskId: string): Promise<Comment[]>;
}

export interface IAddCommentUsecase {
    execute(userId: string, taskId: string, content: string): Promise<Comment>;
}

export interface IEpicProgressUsecase {
    execute(epicId: string): Promise<Task>;
}

export interface IGetTaskUsecase {
    execute(taskId: string): Promise<Task>;
}

export interface ICanChangeStatusUsecase {
    execute(taskId: string, userId: string, permissions: Array<Permissions>): Promise<{ task: Task, canChange: boolean, notAssignee?: boolean }>;
}

export interface ISetStoryPointUsecase {
    execute(storyPoints: StoryPoint, taskId: string): Promise<Task>;
}