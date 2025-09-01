import { ObjectId } from "mongoose";

export interface TaskHistory {
    taskId: ObjectId,
    updatedBy: ObjectId,
    actionType: "ASSIGN" | "STATUS_CHANGE" | "DELETE_SUBTASK" | "CREATE_SUBTASK" | "UPDATED",
    details: {
        assignedTo?: ObjectId,
        oldStatus?: string,
        newStatus?: string,
        subtaskId?: ObjectId,
        subtaskTitle?: string,
        subtaskAssignee?: ObjectId
    },
}