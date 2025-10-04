import { Document, ObjectId } from "mongoose";




export interface Notification extends Document {
    _id: ObjectId,
    senderId: ObjectId,
    recieverId: ObjectId,
    type: "task" | "message",
    message: string,
    link: string,
    data: object,
    read: boolean,
    createdAt: Date
}