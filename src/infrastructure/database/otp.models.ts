
import {Schema, model } from 'mongoose';
import { Otp } from './models/otp.interface';


const otpSchema = new Schema<Otp>({

    email : { type : String, required : true },
    otp : { type : String, required : true },
    createdAt : { type : Date, default : Date.now, expires : 60}
})

const otpModel = model<Otp>('Otp',otpSchema);
export default otpModel;