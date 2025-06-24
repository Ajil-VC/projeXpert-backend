import { Task } from "../../../infrastructure/database/models/task.interface";
import { ITaskRepository } from "../../../domain/repositories/task.repo";


export class UpdateTaskDetailsUsecase {

    constructor(private taskRepo: ITaskRepository) { }

    async execute(task: Task, assigneeId: string): Promise<Task> {

        const updatedTask = await this.taskRepo.updateTaskDetails(task, assigneeId);
        if (!updatedTask) {
            throw new Error('Couldnt update task');
        }
        
        return updatedTask;
    }
}