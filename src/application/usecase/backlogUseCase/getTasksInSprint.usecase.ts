import { IGetTasksInSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class GetTasksInSprintUsecase implements IGetTasksInSprintUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string): Promise<Array<Task>> {

        const tasks = await this._backlogRepo.getTasksInSprint(sprintId);
        return tasks;
    }
}