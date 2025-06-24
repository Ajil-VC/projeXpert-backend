
import { model, Schema } from "mongoose";
import { Conversation } from "./models/conversation.interface";

const conversationSchema = new Schema<Conversation>({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],


    lastActivityType: { type: String, enum: ['call', 'msg'] },
    callStatus: { type: String, enum: ['missed', 'started', 'ended'] },
    callerId: { type: Schema.Types.ObjectId, ref: 'User' },

    lastMessage: { type: String, default: '' },
    projectId: { type: Schema.Types.ObjectId }

}, { timestamps: true })

const conversationModel = model<Conversation>('Conversation', conversationSchema);
export default conversationModel;
