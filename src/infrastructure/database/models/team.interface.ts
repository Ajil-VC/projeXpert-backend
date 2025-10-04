import { ObjectId } from "mongoose";
import { Attachment } from "./user.interface";


export interface Team {

    _id: ObjectId;
    name: string;
    email: string,

    profilePicUrl: Attachment,
    role: ObjectId,

    createdAt?: Date,
    updatedAt?: Date,

}
