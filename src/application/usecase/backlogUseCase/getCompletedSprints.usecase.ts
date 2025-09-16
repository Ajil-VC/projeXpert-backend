import { IGetCompletedSprintsUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";




export class CompletedSprintsUsecase implements IGetCompletedSprintsUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<Array<Sprint>> {

        const sprints = await this._backlogRepo.getCompletedSprintsDetails(projectId);
        return sprints;
    }
}