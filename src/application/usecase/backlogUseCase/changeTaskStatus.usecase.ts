import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IChangeTaskStatusUsecase } from "../../../config/Dependency/user/backlog.di";


export class ChangeTaskStatus implements IChangeTaskStatusUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(taskId: string, status: string): Promise<Task | null> {

        const result = await this._backlogRepo.changeTaskStatus(taskId, status);
        return result;
    }
}