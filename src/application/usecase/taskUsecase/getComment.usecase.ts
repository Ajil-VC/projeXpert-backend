import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment } from "../../../infrastructure/database/models/task.interface";


export class GetCommentsUseCase {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<Comment[]> {

        const result = this.taskRepo.getCommentsInTask(taskId);
        return result;

    }
}