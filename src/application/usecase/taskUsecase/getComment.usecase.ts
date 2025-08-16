import { IGetComments } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment } from "../../../infrastructure/database/models/task.interface";


export class GetCommentsUseCase implements IGetComments {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<any> {

        const result = this.taskRepo.getCommentsInTask(taskId);

        return result;

    }
}