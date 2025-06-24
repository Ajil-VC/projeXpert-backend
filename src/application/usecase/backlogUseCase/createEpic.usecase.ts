import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class CreateEpicUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(epicName: string, projectId: string): Promise<Task> {

        const result = await this.backlogRepo.createEpic(epicName, projectId);
        if(!result){
            throw new Error('Couldnt create epic');
        }
        
        return result;
    }
}