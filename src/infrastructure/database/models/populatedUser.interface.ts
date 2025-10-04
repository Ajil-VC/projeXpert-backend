import { ObjectId } from "mongoose";
import { Company } from "./company.interface";
import { Project } from "./project.interface";

interface WorkSpace extends Document {

    _id: ObjectId;
    name: string;
    companyId: ObjectId;
    members: ObjectId[];

    projects: Project[];
    currentProject?: ObjectId;

    createdAt?: Date;
    updatedAt?: Date;

}


export interface PopulatedUser extends Document {

    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicUrl: string;
    role: 'admin' | 'user';
    companyId: ObjectId | Company;
    workspaceIds: ObjectId[];
    defaultWorkspace : WorkSpace;
    
    forceChangePassword: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}  