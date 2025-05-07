import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class CreateEpicUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(epicName: string, projectId: string): Promise<any> {

        const result = await this.backlogRepo.createEpic(epicName, projectId);
        return result;
    }
}