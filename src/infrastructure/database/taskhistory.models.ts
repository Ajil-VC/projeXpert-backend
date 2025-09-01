import mongoose, { model, Schema } from "mongoose";
import { TaskHistory } from "./models/taskhistory.interface";




const TaskHistorySchema = new Schema<TaskHistory>({

    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, enum: ["ASSIGN", "STATUS_CHANGE", "DELETE_SUBTASK", "UPDATED", "CREATE_SUBTASK"], required: true },
    details: {
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        oldStatus: { type: String },
        newStatus: { type: String },
        subtaskId: { type: Schema.Types.ObjectId, ref: 'Task' },
        subtaskTitle: { type: String },
        subtaskAssignee: { type: Schema.Types.ObjectId, ref: 'User' }
    },

}, { timestamps: true });

const taskHistoryModel = mongoose.models.TaskHistory || model<TaskHistory>('TaskHistory', TaskHistorySchema);
export default taskHistoryModel;