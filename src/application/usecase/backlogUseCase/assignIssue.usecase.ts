import { Task } from "../../../domain/entities/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class AssignIssueUseCase {
    constructor(private backlogRep: IBacklogRepository) { }

    async execute(issueId: string, userId: string): Promise<Task | null> {

        const result = await this.backlogRep.assignIssue(issueId, userId);
        if (!result) {
            throw new Error("Failed to assign issue");
        }
        return result;

    }

}