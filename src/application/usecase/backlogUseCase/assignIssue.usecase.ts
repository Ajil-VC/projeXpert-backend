
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { TaskResponseDetailedDTO } from "../../../dtos/task/taskResponseDTO";
import { IAssignIssueUsecase } from "../../../config/Dependency/user/backlog.di";


export class AssignIssueUseCase implements IAssignIssueUsecase {
    constructor(private _backlogRep: IBacklogRepository) { }

    async execute(issueId: string, userId: string): Promise<TaskResponseDetailedDTO | null> {

        const result = await this._backlogRep.assignIssue(issueId, userId);

        if (!result) {
            throw new Error("Failed to assign issue");
        }
        return result;

    }

}