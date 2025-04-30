
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
import { CompanyRepositoryImp } from "../../infrastructure/repositories/company.repositoryImp";
import { AuthRepositoryImp } from "../../infrastructure/repositories/auth.repositoryImp";
import { ChangePsdUseCase } from "../../application/usecase/auth/changePswd.usecase";


const otpRepository = new OtpRepoImp();
const userRepository = new userRepositoryImp();
const emailService = new EmailServiceImp();
const sendOtpUseCaseOb = new SendOtpUseCase(userRepository, otpRepository, emailService);
const verifyOtpUseCaseOb = new VerifyOtpUseCase(otpRepository);
const securePassWordOb = new SecurePasswordImp();
const companyRepository = new CompanyRepositoryImp();
const registerUseCaseOb = new RegisterUseCase(securePassWordOb, userRepository, companyRepository);
const signinUseCaseOb = new SigninUseCase(userRepository, securePassWordOb);
const authRepository = new AuthRepositoryImp();
const changePsWdUseCaseOb = new ChangePsdUseCase(securePassWordOb, authRepository);


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
        if (typeof result.statusCode === 'undefined') throw new Error('Type mismatch might happened');
        res.status(result.statusCode).json({ status: result.status, token: result.token });

    } catch (err) {

        console.error(`Error occured while loging in ${err}`);
        res.status(500).json({ error: 'Error occured while loging in' })

    }
}


export const createCompany = async (req: Request, res: Response) => {

    try {

        const { email, companyName, passWord } = req.body;

        const registrationStatus = await registerUseCaseOb.execute(email, companyName, passWord);
        if (!registrationStatus.status) {

            switch (registrationStatus.message) {

                case 'Email already in use':
                    res.status(409).json({ status: false, message: 'Email already in use' });
                    return;
                case 'Email already registered':
                    res.status(409).json({ status: false, message: 'Email already registered' });
                    return;
                case 'Company couldnt create':
                    res.status(500).json({ status: false, message: 'Company couldnt create' });
                    return;
                case 'Workspace probably have not created':
                    res.status(500).json({ status: false, message: 'Workspace probably have not created' });
                    return;
                case 'Password couldnt secured':
                    res.status(500).json({ status: false, message: 'Password couldnt secured' });
                    return;
                default:
                    res.status(500).json({ status: false, message: 'Unknown error on registration' });
                    return;
            }

        }

        res.status(200).json({ status: true, token: registrationStatus.token });
        return;

    } catch (err) {

        console.error(`Something went wrong while creating profile. ${err}`);
        res.status(500).json({ status: false, message: 'Something went wrong while creating user profile.' });
        return;
    }
}


export const changePassword = async (req: Request, res: Response) => {

    try {

        const result = await changePsWdUseCaseOb.execute(req.user.email, req.body.passWord);
        console.log(result, 'Res');
        if (!result) throw new Error('Internal error while changng password');

        res.status(200).json({ status: true, message: 'Success' });
        return;
    } catch (err) {
        console.error('Internal error while changing password', err);
        res.status(500).json({ status: false, message: 'Failed' });
    }
}