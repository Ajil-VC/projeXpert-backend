import { ObjectId } from "mongoose";
import { Attachment } from "./user.interface";


export interface Team {

    _id: ObjectId;
    name: string;
    email: string,

    profilePicUrl: Attachment,
    role: ObjectId,

    isBlocked?: boolean;
    systemRole?: 'platform-admin' | 'company-user';
    forceChangePassword?: boolean;

    createdAt?: Date,
    updatedAt?: Date,

}
