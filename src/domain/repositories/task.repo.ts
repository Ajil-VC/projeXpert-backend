import { Task } from "../entities/task.interface";



export interface ITaskRepository {

    updateTaskDetails(task: any, assigneeId: string): Promise<any>;

    completeSprint(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task> | null | boolean>;
}