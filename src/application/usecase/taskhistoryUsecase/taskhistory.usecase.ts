import { ITaskHistoryUsecase } from "../../../config/Dependency/user/taskhistory.di";
import { TaskAction } from "../../../domain/entities/types/task.types";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";



export class TaskHistoryUsecase implements ITaskHistoryUsecase {

    constructor(private taskHistoryRepo: ITaskHistoryRepository) { }

    async execute(
        taskId: string,
        updatedBy: string,
        actionType: TaskAction,
        assignedTo?: string,
        oldStatus?: string,
        newStatus?: string,
        subtaskId?: string,
        subtaskTitle?: string,
        subtaskAssignee?: string
    ): Promise<void> {

        const result = await this.taskHistoryRepo.addHistory(
            taskId,
            updatedBy,
            actionType,
            assignedTo,
            oldStatus,
            newStatus,
            subtaskId,
            subtaskTitle,
            subtaskAssignee);

    }
}