
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IAssignIssueUsecase } from "../../../config/Dependency/user/backlog.di";
import { DeepPopulatedTask } from "../../../infrastructure/database/models/task.interface";


export class AssignIssueUseCase implements IAssignIssueUsecase {
    constructor(private _backlogRep: IBacklogRepository) { }

    async execute(issueId: string, userId: string): Promise<DeepPopulatedTask | null> {

        const result = await this._backlogRep.assignIssue(issueId, userId);

        if (!result) {
            throw new Error("Failed to assign issue");
        }
        return result;

    }

}