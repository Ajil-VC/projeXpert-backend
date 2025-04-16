import { Document, ObjectId  } from "mongoose";


export interface Company extends Document {

    _id: ObjectId;
    name: String;
    email : String;
    owner: ObjectId;
    plan: 'Free' | 'Pro' | 'Enterprise';
    defaultWorkspace : ObjectId;
    workspaces: ObjectId[];

    createdAt?: Date;
    updatedAt?: Date;

}