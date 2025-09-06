import { Document, ObjectId } from "mongoose";
import { Company } from "./company.interface";
import { Roles } from "./role.interface";

export interface Attachment {
    public_id: string;
    url: string;
}

export interface User extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password: String;
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