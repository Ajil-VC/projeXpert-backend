import { IOtpRepository } from "../../../domain/repositories/otp.repo";


export class VerifyOtpUseCase {

    constructor(private otpRepo: IOtpRepository) { }
    async execute(email: string, otp: string): Promise<boolean> {

        const isOTP = await this.otpRepo.findOTP(email, otp);
        if (isOTP) return true;

        return false;
    }
}