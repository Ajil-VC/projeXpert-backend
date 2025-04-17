import { Document, ObjectId } from "mongoose";

export interface WorkSpace extends Document {

    _id: ObjectId;
    name: String;
    companyId: ObjectId;
    members: ObjectId[];

    projects: ObjectId[];
    currentProject: ObjectId;

    createdAt?: Date;
    updatedAt?: Date;

}