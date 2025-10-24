import { IUpdateBurnDownUseCase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class UpdateBurnDownUsecase implements IUpdateBurnDownUseCase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(task: Task): Promise<boolean> {

        const result = await this._backlogRepo.updateBurnDown(task);
        return result;
    }

}