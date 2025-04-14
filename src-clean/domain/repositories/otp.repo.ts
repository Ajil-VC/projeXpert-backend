
import { Otp } from "../entities/otp.interface";

export interface IOtpRepository {

    saveOTP(email : string, otp : string): Promise<boolean>
    findOTP(email: string, otp: string): Promise<Otp | null>
}