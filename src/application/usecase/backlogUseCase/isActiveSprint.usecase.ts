import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class IsActiveSprintUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<boolean> {

        const result = await this.backlogRepo.isActiveSprint(projectId);
        return result;
    }
}