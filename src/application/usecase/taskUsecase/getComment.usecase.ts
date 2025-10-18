import { IGetCommentsUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { PopulatedComment } from "../../../infrastructure/database/models/task.interface";


export class GetCommentsUseCase implements IGetCommentsUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<PopulatedComment[]> {

        const result = this._taskRepo.getCommentsInTask(taskId);

        return result;

    }
}