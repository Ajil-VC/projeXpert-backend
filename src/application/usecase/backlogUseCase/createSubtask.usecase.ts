import { ICreateSubTasksUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";



export class CreateSubTaskUsecase implements ICreateSubTasksUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(title: string, type: string, parentId: string, projectId: string): Promise<Task> {

        const result = await this._backlogRepo.createSubtask(title, type, parentId, projectId);
        return result;
    }

}