import { Comment, Task } from "../../infrastructure/database/models/task.interface";



export interface ITaskRepository {

    updateTaskDetails(task: Task, assigneeId: string): Promise<Task>;

    completeSprint(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task> | null>;

    removeAttachment(publicId: string, taskId: string): Promise<Task>;

    getCommentsInTask(taskId: string): Promise<Comment[]>;

    addComment(userId: string, taskId: string, content: string): Promise<Comment>;

    getAllTasksUnderEpic(epicId: string): Promise<Task[]>;

    updateEpicProgress(epicId: string, progress: number): Promise<Task>;
}