import { Document, ObjectId } from "mongoose";


export interface User extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password?: String; //Optional for google auth users.
    profilePicUrl: String;
    role: 'admin' | 'user';
    isGoogleAccount: boolean;
    googleId?: String; // Only for google auth
    plan: 'Free' | 'Pro' | 'Enterprise';
    workspaceIds: ObjectId[];

    createdAt?: Date;
    updatedAt?: Date;

}  