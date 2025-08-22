import { IRemoveTask } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class RemoveTaskUsecase implements IRemoveTask {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(taskId: string): Promise<boolean> {

        const result = await this.backlogRepo.removeTask(taskId);
        return result;
    }

}