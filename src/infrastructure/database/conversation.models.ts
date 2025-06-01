
import { model, Schema } from "mongoose";
import { Conversation } from "../../domain/entities/conversation.interface";

const conversationSchema = new Schema<Conversation>({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String, default: '' },
    projectId: { type: Schema.Types.ObjectId }

}, { timestamps: true })

const conversationModel = model<Conversation>('Conversation', conversationSchema);
export default conversationModel;
