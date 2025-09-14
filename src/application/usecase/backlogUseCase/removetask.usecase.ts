import { IRemoveTaskUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class RemoveTaskUsecase implements IRemoveTaskUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(taskId: string): Promise<boolean> {

        const result = await this._backlogRepo.removeTask(taskId);
        return result;
    }

}