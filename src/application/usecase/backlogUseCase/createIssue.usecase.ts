import { ICreateIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";



export class CreateIssueUsecase implements ICreateIssueUsecase{

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string) {

        const result = this._backlogRepo.createIssue(projectId, issueType, issueName, taskGroup, epicId);

        if (!result) throw new Error('Error occured while creating issue');
        return result;
    }
}