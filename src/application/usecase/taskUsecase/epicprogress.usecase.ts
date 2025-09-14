import { IEpicProgressUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class EpicProgressUsecase implements IEpicProgressUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(epicId: string): Promise<Task> {

        const tasks = await this._taskRepo.getAllTasksUnderEpic(epicId);

        const totalTasks = tasks.length;
        const completedTaskCount = tasks.reduce((acc, curr) => {
            if (curr.status === "done") {
                acc++;
            }
            return acc;
        }, 0)
        const completionPercentage = totalTasks > 0
            ? (completedTaskCount / totalTasks) * 100
            : 0;



        const updatedTask = await this._taskRepo.updateEpicProgress(epicId, Math.floor(completionPercentage));

        return updatedTask;
    }
}