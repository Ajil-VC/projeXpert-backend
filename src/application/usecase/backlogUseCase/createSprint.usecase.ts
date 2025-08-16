import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { ICreateSprint } from "../../../config/Dependency/user/backlog.di";


export class CreateSprintUsecase implements ICreateSprint {
    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, sprintIds: Array<string>, userId: string): Promise<Sprint> {

        const result = await this.backlogRepo.createSprint(projectId, sprintIds, userId);
        if (!result) throw new Error('Error while creating sprint');

        return result;
    }
}