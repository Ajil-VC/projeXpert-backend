
import { ObjectId, Document } from "mongoose";

export interface Project extends Document {

    _id: ObjectId;
    name: String;
    workSpace: ObjectId;
    owner: ObjectId;
    members: ObjectId[];
    status: String;
    priority: String;

    createdAt?: Date;
    updatedAt?: Date;
}