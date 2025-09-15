import { ISetStoryPointUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { StoryPoint, Task } from "../../../infrastructure/database/models/task.interface";


export class SetStoryPointUsecase implements ISetStoryPointUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(storyPoints: StoryPoint, taskId: string): Promise<Task> {

        const updatedTask = await this._taskRepo.setStoryPoint(storyPoints, taskId);
        return updatedTask;

    }
}