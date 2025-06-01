import { Document, ObjectId } from "mongoose";


export interface Message extends Document {

    _id: ObjectId,
    conversationId: ObjectId,
    senderId: ObjectId,
    receiverId: ObjectId,
    projectId: ObjectId,
    message: string,
    seen: boolean
    createdAt?: Date;
    updatedAt?: Date;

}