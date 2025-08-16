import { IIsActiveSprint } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class IsActiveSprintUsecase implements IIsActiveSprint {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<boolean> {

        const result = await this.backlogRepo.isActiveSprint(projectId);
        return result;
    }
}