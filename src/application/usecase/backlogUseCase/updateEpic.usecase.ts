import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IUpdateEpicUsecase } from "../../../config/Dependency/user/backlog.di";



export class UpdateEpicUsecase implements IUpdateEpicUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task> {

        const result = await this._backlogRepo.updateEpic(title, description, startDate, endDate, status, epicId);
        if (!result) {
            throw new Error('Couldnt create epic');
        }

        return result;
    }
}