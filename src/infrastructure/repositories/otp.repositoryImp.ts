import { Otp } from "../../domain/entities/otp.interface";
import { IOtpRepository } from "../../domain/repositories/otp.repo";
import otpModel from "../database/otp.models";


export class OtpRepoImp implements IOtpRepository {

    async saveOTP(email: string, otp: string): Promise<boolean> {

        const otpSaved = await otpModel.create({ email, otp });
        if (otpSaved) return true;

        return false;

    }

    async findOTP(email: string, otp: string): Promise<Otp | null> {

        const otpRecord = await otpModel.findOne({ email: email, otp: otp }).exec();
        if (otpRecord) return otpRecord;

        return null;
    }

}