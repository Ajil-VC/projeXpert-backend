import { IVerifyOtp } from "../../../config/Dependency/auth/auth.di";
import { IOtpRepository } from "../../../domain/repositories/otp.repo";


export class VerifyOtpUseCase implements IVerifyOtp {

    constructor(private otpRepo: IOtpRepository) { }
    async execute(email: string, otp: string): Promise<boolean> {

        const isOTP = await this.otpRepo.findOTP(email, otp);
        if (isOTP) return true;

        return false;
    }
}