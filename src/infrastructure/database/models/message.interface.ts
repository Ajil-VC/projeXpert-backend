import { Document, ObjectId } from "mongoose";


export interface Message extends Document {

    _id: ObjectId,
    conversationId: ObjectId,
    senderId: ObjectId,
    receiverId: ObjectId,
    message: string,
    seen: boolean,

    type: 'text' | 'call',
    callStatus: 'started' | 'ended' | 'missed',
    duration: number,

    createdAt?: Date;
    updatedAt?: Date;

}