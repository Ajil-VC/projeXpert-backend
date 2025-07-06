import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class UpdateEpicUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(title: string, description: string, startDate: string, endDate: string, epicId: string): Promise<Task> {

        const result = await this.backlogRepo.updateEpic(title, description, startDate, endDate, epicId);
        if (!result) {
            throw new Error('Couldnt create epic');
        }

        return result;
    }
}