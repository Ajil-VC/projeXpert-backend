import { Task } from "../../../infrastructure/database/models/task.interface";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { ICompleteSprintUsecase } from "../../../config/Dependency/user/task.di";



export class CompleteSprintUsecase implements ICompleteSprintUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task>> {


        const result = await this._taskRepo.completeSprint(completingSprintId, movingSprintId, projectId);
        if (!result) {
            throw new Error('Sprint couldnt complete.');
        }
        return result;
    }
}