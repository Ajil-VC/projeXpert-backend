import { model, Schema } from "mongoose";
import { Message } from "./models/message.interface";
import mongoose from "mongoose";

const messageSchema = new Schema<Message>({

    conversationId: { type: Schema.Types.ObjectId },
    senderId: { type: Schema.Types.ObjectId },
    receiverId: { type: Schema.Types.ObjectId },
    message: { type: String },
    seen: { type: Boolean, default: false },

    type: { type: String, enum: ['text', 'call'], default: 'text' },
    callStatus: { type: String, enum: ['started', 'ended', 'missed'], required: false },
    duration: { type: Number, default: 0 },

}, { timestamps: true })

const messageModel = mongoose.models.Message || model<Message>('Message', messageSchema);
export default messageModel;