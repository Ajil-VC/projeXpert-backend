import { Document } from "mongoose";

//Extending to document only to avail the mongoose properties and methods like save(). TO include Intellisence.
export interface Otp extends Document {

    email : string,
    otp : string,
    createdAt? : Date
    
}