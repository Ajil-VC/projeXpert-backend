import { IIsActiveSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class IsActiveSprintUsecase implements IIsActiveSprintUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<boolean> {

        const result = await this._backlogRepo.isActiveSprint(projectId);
        return result;
    }
}