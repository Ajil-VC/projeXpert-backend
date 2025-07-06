import { Task } from "../../../infrastructure/database/models/task.interface";
import { ITaskRepository } from "../../../domain/repositories/task.repo";



export class CompleteSprintUsecase {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task>> {


        const result = await this.taskRepo.completeSprint(completingSprintId, movingSprintId, projectId);
        if (!result) {
            throw new Error('Sprint couldnt complete.');
        }
        return result;
    }
}