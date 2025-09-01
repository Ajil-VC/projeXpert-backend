import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IUpdateEpic } from "../../../config/Dependency/user/backlog.di";



export class UpdateEpicUsecase implements IUpdateEpic {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task> {

        const result = await this.backlogRepo.updateEpic(title, description, startDate, endDate, status, epicId);
        if (!result) {
            throw new Error('Couldnt create epic');
        }

        return result;
    }
}