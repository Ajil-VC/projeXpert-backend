
import {Schema ,Document, model } from 'mongoose';

//Extending to document only to avail the mongoose properties and methods like save(). TO include Intellisence.
export interface Otp extends Document {

    email : string,
    otp : string,
    createdAt : Date
}

const otpSchema = new Schema<Otp>({

    email : { type : String, required : true },
    otp : { type : String, required : true },
    createdAt : { type : Date, default : Date.now, expires : 60}
})

const otpModel = model<Otp>('Otp',otpSchema);
export default otpModel;