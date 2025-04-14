import { Document, ObjectId } from "mongoose";

export interface WorkSpace extends Document {

    _id: ObjectId;
    name: String;
    owner: ObjectId;
    members: ObjectId[];
    isDefault: Boolean;

    createdAt?: Date;
    updatedAt?: Date;
}