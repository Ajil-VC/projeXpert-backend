
import { Request, Response } from "express";

import { SendOtpUseCase } from "../../application/usecase/auth/sendOtp.usecase";
import { OtpRepoImp } from "../../infrastructure/repositories/otp.repositoryImp";
import { userRepositoryImp } from "../../infrastructure/repositories/user.repositoryImp";
import { useCaseResult } from "../../application/shared/useCaseResult";
import { EmailServiceImp } from "../../infrastructure/services/email.serviceImp";
import { VerifyOtpUseCase } from "../../application/usecase/auth/VerifyOtp.usecase";
import { RegisterUseCase } from "../../application/usecase/auth/register.usecase";
import { SecurePasswordImp } from "../../infrastructure/services/securepassword.serviceImp";
import { SigninUseCase } from "../../application/usecase/auth/signin.usecase";


const otpRepository = new OtpRepoImp();
const userRepository = new userRepositoryImp();
const emailService = new EmailServiceImp();
const sendOtpUseCaseOb = new SendOtpUseCase(userRepository, otpRepository, emailService);
const verifyOtpUseCaseOb = new VerifyOtpUseCase(otpRepository);
const securePassWordOb = new SecurePasswordImp();
const registerUseCaseOb = new RegisterUseCase(securePassWordOb, userRepository);
const signinUseCaseOb = new SigninUseCase(userRepository, securePassWordOb);


export const sendOtpToMail = async (req: Request, res: Response): Promise<void> => {

    try {

        const email: string = req.body.email;


        const result: useCaseResult = await sendOtpUseCaseOb.execute(email);
        if (!result.status) {
            res.status(409).json({ result });
            return;
        }

        res.status(200).json({ result });

    } catch (err) {
        console.error("Something went wrong while generating otp.", err)
        res.status(500).json({ error: "Something went wrong while generating otp." });
    }
}


export const validateOtp = async (req: Request, res: Response): Promise<void> => {


    try {

        const email = req.body.email;
        const otpFromUser = req.body.otp + '';

        const isVerified = await verifyOtpUseCaseOb.execute(email, otpFromUser);

        if (isVerified) {
            res.status(200).json({ message: "otp Validated", status: true });
        } else {
            res.status(404).json({ message: "Invalid otp", status: false });
        }

    } catch (err) {
        console.error("Something went wrong while validating otp", err);
        res.status(500).json({ error: "Something went wrong while validating otp" });
    }
}


export const signIn = async (req: Request, res: Response): Promise<void> => {

    try {

        const { email, passWord } = req.body;

        const result = await signinUseCaseOb.execute(email, passWord);
        res.status(result.statusCode).json({ status: result.status, token: result.token });
        console.log('Here result:', result);

    } catch (err) {

        console.error(`Error occured while loging in ${err}`);
        res.status(500).json({ error: 'Error occured while loging in' })

    }
}


export const createProfile = async (req: Request, res: Response) => {

    try {

        const { email, userName, passWord } = req.body;

        const registeredData = await registerUseCaseOb.execute(email, userName, passWord);
        if (registeredData) {

            res.status(200).json({ status: true, token: registeredData.token })
        }
       

    } catch (err) {

        console.error(`Something went wrong while creating profile. ${err}`);
        res.status(500).json({ status: false, message: 'Something went wrong while creating user profile.' });
    }
}
