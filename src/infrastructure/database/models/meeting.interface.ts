import { Document, ObjectId } from "mongoose";
import { Team } from "./team.interface";




export interface Meeting extends Document {
    _id: number;
    companyId: ObjectId;
    roomName: string;
    meetingDate: Date;
    meetingTime: string;
    description: string;
    members: Array<ObjectId>;
    status: 'upcoming' | 'ongoing' | 'completed';
    createdBy: ObjectId;

    recurring: boolean;

    url: string;
    roomId: string;

    createdAt?: Date;
    updatedAt?: Date;
}