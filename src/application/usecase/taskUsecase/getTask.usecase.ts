import { IGetTask } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class GetTask implements IGetTask {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(taskId: string): Promise<Task> {

        const task = await this.taskRepo.getTask(taskId);
        return task;

    }

}