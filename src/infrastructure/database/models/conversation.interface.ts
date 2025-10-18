
import { Document, ObjectId } from "mongoose";
import { Team } from "./team.interface";

export interface Conversation extends Document {

    _id: ObjectId,
    participants: ObjectId[],
    companyId: ObjectId,

    lastActivityType: 'call' | 'msg',
    callStatus: 'missed' | 'started' | 'ended',
    callerId: ObjectId,

    lastMessage: string,
    createdAt?: Date;
    updatedAt?: Date;

}

export interface PopulatedConversation extends Omit<Conversation, 'participants'> {
    participants: Team[];
}