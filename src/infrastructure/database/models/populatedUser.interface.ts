import { ObjectId } from "mongoose";
import { Company } from "./company.interface";
import { Project } from "./project.interface";

interface WorkSpace extends Document {

    _id: ObjectId;
    name: String;
    companyId: ObjectId;
    members: ObjectId[];

    projects: Project[];
    currentProject?: ObjectId;

    createdAt?: Date;
    updatedAt?: Date;

}


export interface PopulatedUser extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password: String;
    profilePicUrl: String;
    role: 'admin' | 'user';
    companyId: ObjectId | Company;
    workspaceIds: ObjectId[];
    defaultWorkspace : WorkSpace;
    
    forceChangePassword: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}  