
import { ObjectId, Document } from "mongoose";
import { Team } from "./team.interface";

export interface Project extends Document {

    _id: ObjectId;
    name: string;
    workSpace: ObjectId;
    companyId: ObjectId;
    members: ObjectId[];
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;

}

export interface PopulatedProject extends Omit<Project, 'members'> {
    members: Team[];
}