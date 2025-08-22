import { IGetSubtasks } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";






export class GetSubtasksUsecase implements IGetSubtasks {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(parentId: string): Promise<Task[]> {

        const result = await this.backlogRepo.getSubtasks(parentId);
        return result;
    }

}