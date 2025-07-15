import { ObjectId } from "mongoose";
import { Attachment } from "./user.interface";


export interface Team {

    _id: ObjectId;
    name: String;
    email: String,

    profilePicUrl: Attachment,
    role: "user" | "admin",

    createdAt?: Date,
    updatedAt?: Date,

}
