
import { Document, ObjectId } from "mongoose";
import { Team } from "./team.interface";


export interface Conversation extends Document {

    _id: ObjectId,
    participants: ObjectId[],
    projectId: ObjectId,
    lastMessage: string,
    createdAt?: Date;
    updatedAt?: Date;

}

