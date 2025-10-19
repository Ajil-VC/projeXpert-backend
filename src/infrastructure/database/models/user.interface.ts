import { Document, ObjectId } from "mongoose";
import { Company } from "./company.interface";
import { WorkSpace } from "./workspace.interface";
import { Roles } from "./role.interface";
import { Project } from "./project.interface";

export interface Attachment {
    public_id: string;
    url: string;
}

export interface User extends Document {

    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicUrl: Attachment;
    role: ObjectId;
    companyId: ObjectId | Company;
    workspaceIds: ObjectId[];
    defaultWorkspace: ObjectId;
    lastActiveProjectId?: ObjectId | null;
    forceChangePassword: boolean;

    isBlocked: boolean;

    systemRole: 'platform-admin' | 'company-user';

    createdAt?: Date;
    updatedAt?: Date;

}


export interface UserDeepPopulated extends Omit<User, 'workspaceIds' | 'companyId' | 'role' | 'defaultWorkspace'> {

    workspaceIds: WorkSpace;
    companyId: Company;
    role: Roles;
    defaultWorkspace: (Omit<WorkSpace, 'projects'> & { projects: Project[] }) | string;
}