import { IGetCommentsUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";


export class GetCommentsUseCase implements IGetCommentsUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<any> {

        const result = this._taskRepo.getCommentsInTask(taskId);

        return result;

    }
}