import { IAddCommentUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment } from "../../../infrastructure/database/models/task.interface";


export class AddCommentUseCase implements IAddCommentUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(userId: string, taskId: string, content: string): Promise<any> {

        const result = await this._taskRepo.addComment(userId, taskId, content);
        return result;

    }
}