import { Document, ObjectId } from "mongoose";


export interface Activity extends Document {
    _id: ObjectId;
    companyId: ObjectId;
    projectId: ObjectId;
    user: ObjectId;
    action: string;
    target: string;
    createdAt?: Date;
    updatedAt?: Date;
}