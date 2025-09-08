import { TaskAction } from "./task.types";

export interface TaskHistoryParams {
    taskId: string;
    updatedBy: string;
    actionType: TaskAction;
    assignedTo?: string;
    oldStatus?: string;
    newStatus?: string;
    subtaskId?: string;
    subtaskTitle?: string;
    subtaskAssignee?: string;
}