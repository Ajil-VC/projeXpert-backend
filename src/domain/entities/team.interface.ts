import { ObjectId } from "mongoose";



export interface Team {

    _id: ObjectId;
    name: String;
    email: String,

    profilePicUrl: String,
    role: "user" | "admin",

    createdAt?: Date,
    updatedAt?: Date,

}
