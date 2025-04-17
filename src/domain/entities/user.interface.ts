import { Document, ObjectId } from "mongoose";


export interface User extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password: String;
    profilePicUrl: String;
    role: 'admin' | 'user';
    companyId: ObjectId;
    workspaceIds: ObjectId[];
    defaultWorkspace : ObjectId;
    
    forceChangePassword: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}  