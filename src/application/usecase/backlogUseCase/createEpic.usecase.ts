import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { ICreateEpic } from "../../../config/Dependency/user/backlog.di";



export class CreateEpicUsecase implements ICreateEpic{

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task> {

        const result = await this.backlogRepo.createEpic(title, description, startDate, endDate, projectId, userId);
        if (!result) {
            throw new Error('Couldnt create epic');
        }

        return result;
    }
}