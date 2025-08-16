import { IAddComment } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment } from "../../../infrastructure/database/models/task.interface";


export class AddCommentUseCase implements IAddComment {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(userId: string, taskId: string, content: string): Promise<any> {

        const result = await this.taskRepo.addComment(userId, taskId, content);
        return result;

    }
}