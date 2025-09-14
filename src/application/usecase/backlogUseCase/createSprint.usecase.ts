import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { ICreateSprintUsecase } from "../../../config/Dependency/user/backlog.di";


export class CreateSprintUsecase implements ICreateSprintUsecase {
    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, sprintIds: Array<string>, userId: string): Promise<Sprint> {

        const result = await this._backlogRepo.createSprint(projectId, sprintIds, userId);
        if (!result) throw new Error('Error while creating sprint');

        return result;
    }
}