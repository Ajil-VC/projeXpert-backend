
import mongoose, { model, Schema } from "mongoose";
import { Comment } from "./models/task.interface";



const CommentSchema = new Schema<Comment>({
    taskId: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true }
}, { timestamps: true });

const commentModel = mongoose.models.Comment || model<Comment>('Comment', CommentSchema);
export default commentModel;