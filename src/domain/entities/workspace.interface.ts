import { Document, ObjectId } from "mongoose";

export interface WorkSpace extends Document {

    _id: ObjectId;
    name: String;
    owner: ObjectId;
    members: ObjectId[];
    isDefault: Boolean;
    currentProject : ObjectId;  

    createdAt?: Date;
    updatedAt?: Date;
}