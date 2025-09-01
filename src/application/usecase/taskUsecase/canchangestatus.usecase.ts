import { ICanChangeStatus } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";



export class CanChangeTaskStatus implements ICanChangeStatus {

    constructor(private taskRepo: ITaskRepository) { }
    async execute(taskId: string): Promise<{ task: Task, canChange: boolean }> {

        const task = await this.taskRepo.getTask(taskId);
        if (!task.parentId) {

            if (!task.sprintId) {
                return { task, canChange: false };
            }

            const sprint = task.sprintId as Sprint;
            if (sprint.status !== 'active') {
                return { task, canChange: false };
            }

        } else {

            const parentTask = await this.taskRepo.getTask(task.parentId as unknown as string);
            if (!parentTask.sprintId) {
                return { task, canChange: false };
            }

            const sprint = parentTask.sprintId as Sprint;
            if (sprint.status !== 'active') {
                return { task, canChange: false };
            }

        }

        return { task, canChange: true };
    }
}
