import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";




export class GetTasksUseCase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, userRole: string, userId: string) {

        const result = this.backlogRepo.getTasks(projectId, userRole, userId);
        return result;
    }
}