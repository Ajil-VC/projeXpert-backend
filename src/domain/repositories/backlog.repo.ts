import { Task } from "../entities/task.interface";


export interface IBacklogRepository {

    createEpic(epicName: string, projectId: string): Promise<Task | null>;

    getTasks(projectId: string, userRole: string, userId: string): Promise<any>;
}