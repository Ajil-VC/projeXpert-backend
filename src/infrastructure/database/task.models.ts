import mongoose, { model, Schema } from "mongoose";
import { Attachment, Task } from "./models/task.interface";


const AttachmentSchema = new Schema<Attachment>({
    public_id: { type: String, required: true },
    url: { type: String, required: true },

}, { _id: false });


const TaskSchema = new Schema<Task>({

    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["task", "epic", "story", "subtask", "bug"] },
    status: { type: String, enum: ["in-progress", "todo", "done"], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    assignedTo: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    epicId: { type: Schema.Types.ObjectId, default: null, ref: 'Task' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    storyPoints: { type: Number, enum: [0, 1, 2, 3, 5, 8, 13, 21], default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },

    sprintId: { type: Schema.Types.ObjectId, default: null, ref: 'Sprint' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Task' },
    subtasks: { type: [Schema.Types.ObjectId], ref: 'Task', default: [] },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },

    attachments: {
        type: [AttachmentSchema],
        default: []
    }

}, { timestamps: true })

const taskModel = mongoose.models.Task || model<Task>('Task', TaskSchema);
export default taskModel;