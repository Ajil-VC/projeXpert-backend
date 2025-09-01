import { TaskAction } from "../../../domain/entities/types/task.types";
import { TaskHistory } from "../../../infrastructure/database/models/taskhistory.interface";



export interface ITaskHistoryUsecase {

    execute(
        taskId: string,
        updatedBy: string,
        actionType: TaskAction,
        assignedTo?: string,
        oldStatus?: string,
        newStatus?: string,
        subtaskId?: string,
        subtaskTitle?: string,
        subtaskAssignee?: string
    ): Promise<void>;

}


export interface IGetTaskHistory {
    execute(taskId: string): Promise<TaskHistory[]>;
}