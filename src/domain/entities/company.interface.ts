import { Document, ObjectId } from "mongoose";


export interface Company extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    plan: 'Free' | 'Pro' | 'Enterprise';

    workspaces: ObjectId[];

    isBlocked: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}