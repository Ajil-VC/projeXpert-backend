import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment } from "../../../infrastructure/database/models/task.interface";


export class AddCommentUseCase {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(userId: string, taskId: string, content: string): Promise<Comment> {

        const result = await this.taskRepo.addComment(userId, taskId, content);
        return result;

    }
}