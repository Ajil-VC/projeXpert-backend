import { IGetTaskHistoryUsecase } from "../../../config/Dependency/user/taskhistory.di";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";
import { TaskHistory } from "../../../infrastructure/database/models/taskhistory.interface";


export class GetTaskHistory implements IGetTaskHistoryUsecase {

    constructor(private _taskHistoryRepo: ITaskHistoryRepository) { }

    async execute(taskId: string): Promise<TaskHistory[]> {

        const history = await this._taskHistoryRepo.getTaskHistory(taskId);
        return history;

    }
}