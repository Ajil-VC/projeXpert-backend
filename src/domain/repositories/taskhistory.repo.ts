import { TaskHistory } from "../../infrastructure/database/models/taskhistory.interface";
import { TaskAction } from "../entities/types/task.types";


export interface ITaskHistoryRepository {

    addHistory(
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

    getTaskHistory(taskId: string): Promise<TaskHistory[]>;
}