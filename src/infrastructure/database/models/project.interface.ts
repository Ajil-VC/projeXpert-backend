
import { ObjectId, Document } from "mongoose";

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