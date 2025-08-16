import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { TaskMapper } from "../../../mappers/task/task.mapper";
import { TaskResponseDetailedDTO } from "../../../dtos/task/taskResponseDTO";
import { IAssignIssue } from "../../../config/Dependency/user/backlog.di";


export class AssignIssueUseCase implements IAssignIssue {
    constructor(private backlogRep: IBacklogRepository) { }

    async execute(issueId: string, userId: string): Promise<TaskResponseDetailedDTO | null> {

        const result = await this.backlogRep.assignIssue(issueId, userId);

        if (!result) {
            throw new Error("Failed to assign issue");
        }
        return result;

    }

}