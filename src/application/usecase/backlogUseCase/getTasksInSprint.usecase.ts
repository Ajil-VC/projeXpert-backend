import { IGetSprintWithTasksUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class GetSprintWithTasksUsecase implements IGetSprintWithTasksUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string): Promise<Sprint> {

        const sprint = await this._backlogRepo.getSprintWithTasks(sprintId);
        return sprint;
    }
}