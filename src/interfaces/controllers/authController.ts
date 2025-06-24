
import { NextFunction, Request, Response } from "express";

import { sendOtpUsecase } from "../../config/Dependency/auth/auth.di";
import { verifyOtpUsecase } from "../../config/Dependency/auth/auth.di";
import { signinUsecase } from "../../config/Dependency/auth/auth.di";
import { registerUsecase } from "../../config/Dependency/auth/auth.di";
import { changePasswordUsecase } from "../../config/Dependency/auth/auth.di";
import { refreshTokenUsecase } from "../../config/Dependency/auth/auth.di";


import { useCaseResult } from "../../application/shared/useCaseResult";


export const sendOtpToMail = async (req: Request, res: Response): Promise<void> => {

    try {

        const email: string = req.body.email;


        const result: useCaseResult = await sendOtpUsecase.execute(email);
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

        const isVerified = await verifyOtpUsecase.execute(email, otpFromUser);

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


export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {

        const { email, passWord } = req.body;

        const result = await signinUsecase.execute(email, passWord);

        if (typeof result.statusCode === 'undefined') throw new Error('Type mismatch might happened');

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false, //If it is https set it as true.
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(result.statusCode).json({
            status: result.status,
            token: result.token,
            forceChangePassword: result.additional.forceChangePassword
        });

    } catch (err) {

        // console.error(`Error occured while loging in ${err}`);
        // res.status(500).json({ error: 'Error occured while loging in' })
        next(err)
    }
}


export const createCompany = async (req: Request, res: Response) => {

    try {

        const { email, companyName, passWord } = req.body;

        const registrationStatus = await registerUsecase.execute(email, companyName, passWord);
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

        const result = await changePasswordUsecase.execute(req.user.email, req.body.oldPassword, req.body.passWord);

        if (!result) {

            res.status(404).json({ status: false, message: 'Try again, default password might be wrong.' });
            return;
        };

        res.status(200).json({ status: true, message: 'Success' });
        return;
    } catch (err) {
        console.error('Internal error while changing password', err);
        res.status(500).json({ status: false, message: 'Failed' });
    }
}

export const isVerified = async (req: Request, res: Response) => {

    try {

        if (req.user) {
            res.status(200).json({ status: true, user: req.user });
            return;
        } else {
            res.status(401).json({ status: false });
            return;
        }

    } catch (err) {

        console.error('Internal error while authenticating user', err);
        res.status(500).json({ status: false, message: 'Not authenticated' });
    }
}

export const refreshToken = async (req: Request, res: Response) => {

    try {


        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ message: 'No refresh token provided' });
            return
        }

        const result = await refreshTokenUsecase.execute(refreshToken);
        if (!result || !result.statusCode) {
            throw new Error('Couldnt create new token');
        } else if (!result.status) {
            res.status(result.statusCode).json({ status: result.statusCode, message: result.message });
            return;
        } else {

            res.status(result.statusCode).json({
                status: result.status,
                token: result.token,
                forceChangePassword: result.additional
            });

        }


    } catch (err) {
        console.error('Internal error while refreshing token', err);
        res.status(500).json({ status: false, message: 'Token couldnt refresh' });

    }
}