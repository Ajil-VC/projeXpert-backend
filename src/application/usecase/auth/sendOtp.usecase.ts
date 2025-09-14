import { IOtpRepository } from "../../../domain/repositories/otp.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";

import otpGenerator from 'otp-generator';
import { IEmailService } from "../../../domain/services/email.interface";
import { useCaseResult } from "../../shared/useCaseResult";
import { ISendOtpUsecase } from "../../../config/Dependency/auth/auth.di";


export class SendOtpUseCase implements ISendOtpUsecase {

    constructor(
        private _userRepo: IUserRepository,
        private _otpRepo: IOtpRepository,
        private _sendEmail: IEmailService
    ) { }

    async execute(email: string): Promise<useCaseResult> {

        const existingUser = await this._userRepo.findByEmail(email);
        if (existingUser) return { status: false, message: 'Email already exists', statusCode: 409 };

        //OTP Generating
        const otp = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        console.log(`Otp for email ${email} is : ${otp}`);

        await this._otpRepo.saveOTP(email, otp);

        const subject = "Your OTP Code";
        const text = `OTP For ProjeXpert is : ${otp}`
        const isEmailSent = await this._sendEmail.send(email, subject, text);

        if (isEmailSent) return { status: true, message: "OTP sent to your email", statusCode: 201 }

        return { status: false, message: "Something went wrong while sending otp", statusCode: 500 };
    }

}
