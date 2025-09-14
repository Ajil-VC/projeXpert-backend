import { IGetTaskUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class GetTask implements IGetTaskUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<Task> {

        const task = await this._taskRepo.getTask(taskId);
        return task;

    }

}