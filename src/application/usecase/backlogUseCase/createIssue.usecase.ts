import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class CreateIssueUsecase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string) {

        const result = this.backlogRepo.createIssue(projectId, issueType, issueName, taskGroup, epicId);
        return result;
    }
}