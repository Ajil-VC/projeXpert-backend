import { model, Schema } from "mongoose";
import { Task } from "../../domain/entities/task.interface";


const TaskSchema = new Schema<Task>({

    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["task", "epic", "story", "subtask"] },
    status: { type: String, enum: ["in-progress", "todo", "done"], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    assignedTo: { type: Schema.Types.ObjectId },
    epicId: { type: Schema.Types.ObjectId },
    sprintId: { type: Schema.Types.ObjectId },
    parentId: { type: Schema.Types.ObjectId },
    projectId: { type: Schema.Types.ObjectId }

}, { timestamps: true })

const taskModel = model<Task>('Task',TaskSchema);
export default taskModel;