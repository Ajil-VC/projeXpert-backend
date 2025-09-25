import { IIsActiveSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";


export class IsActiveSprintUsecase implements IIsActiveSprintUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<Sprint | null> {

        const result = await this._backlogRepo.isActiveSprint(projectId);
        return result;
    }
}