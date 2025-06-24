import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class ChangeTaskStatus {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(taskId: string, status: string): Promise<Task> {

        const result = await this.backlogRepo.changeTaskStatus(taskId, status);
        if (!result) {
            throw new Error('Something went wrong while updating task status.');
        }
        return result;
    }
}