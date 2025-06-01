import { model, Schema } from "mongoose";
import { Message } from "../../domain/entities/message.interface";

const messageSchema = new Schema<Message>({

    conversationId: { type: Schema.Types.ObjectId },
    senderId: { type: Schema.Types.ObjectId },
    receiverId: { type: Schema.Types.ObjectId },
    projectId: { type: Schema.Types.ObjectId },
    message: { type: String },
    seen: { type: Boolean, default: false },

}, { timestamps: true })

const messageModel = model<Message>('Message', messageSchema);
export default messageModel;
