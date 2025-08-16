import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IChangeTaskStatus } from "../../../config/Dependency/user/backlog.di";


export class ChangeTaskStatus implements IChangeTaskStatus {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(taskId: string, status: string): Promise<Task> {

        const result = await this.backlogRepo.changeTaskStatus(taskId, status);
        if (!result) {
            throw new Error('Something went wrong while updating task status.');
        }
        return result;
    }
}