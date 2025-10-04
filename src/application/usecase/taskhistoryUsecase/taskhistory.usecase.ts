import { ITaskHistoryUsecase } from "../../../config/Dependency/user/taskhistory.di";
import { TaskHistoryParams } from "../../../domain/entities/types/taskHistoryParams";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";



export class TaskHistoryUsecase implements ITaskHistoryUsecase {

    constructor(private _taskHistoryRepo: ITaskHistoryRepository) { }

    async execute(params: TaskHistoryParams): Promise<void> {

        await this._taskHistoryRepo.addHistory(params);
    }


}