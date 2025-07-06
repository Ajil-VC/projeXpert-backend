import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class CreateEpicUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task> {

        const result = await this.backlogRepo.createEpic(title, description, startDate, endDate, projectId, userId);
        if (!result) {
            throw new Error('Couldnt create epic');
        }

        return result;
    }
}