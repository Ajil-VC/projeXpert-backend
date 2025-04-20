import { Document, ObjectId } from "mongoose";
import { Company } from "./company.interface";


export interface User extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password: String;
    profilePicUrl: String;
    role: 'admin' | 'user';
    companyId: ObjectId | Company;
    workspaceIds: ObjectId[];
    defaultWorkspace : ObjectId;
    
    forceChangePassword: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}  