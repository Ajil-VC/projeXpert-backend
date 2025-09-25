import { ISetSprintVelocityUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class SetSprintVelocityUsecase implements ISetSprintVelocityUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string, projectId: string): Promise<boolean> {

        const result = await this._backlogRepo.setSprintVelocity(sprintId, projectId);
        return result;
    }
}