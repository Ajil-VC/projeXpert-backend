
import { ObjectId, Document } from "mongoose";

export interface Project extends Document {

    _id: ObjectId;
    name: String;
    workSpace: ObjectId;
    companyId: ObjectId;
    members: ObjectId[];
    status: 'active' | 'archived' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';

    createdAt?: Date;
    updatedAt?: Date;

}