import { ITaskHistoryUsecase } from "../../../config/Dependency/user/taskhistory.di";
import { TaskAction } from "../../../domain/entities/types/task.types";
import { TaskHistoryParams } from "../../../domain/entities/types/taskHistoryParams";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";



export class TaskHistoryUsecase implements ITaskHistoryUsecase {

    constructor(private taskHistoryRepo: ITaskHistoryRepository) { }

    async execute(params: TaskHistoryParams): Promise<void> {

        const result = await this.taskHistoryRepo.addHistory(params);
    }


}