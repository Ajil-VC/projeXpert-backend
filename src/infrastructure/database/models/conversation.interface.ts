
import { Document, ObjectId } from "mongoose";

export interface Conversation extends Document {

    _id: ObjectId,
    participants: ObjectId[],
    projectId: ObjectId,

    lastActivityType: 'call' | 'msg',
    callStatus: 'missed' | 'started' | 'ended',
    callerId: ObjectId,

    lastMessage: string,
    createdAt?: Date;
    updatedAt?: Date;

}

