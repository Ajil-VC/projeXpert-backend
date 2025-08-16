
import { NextFunction, Request, Response } from "express";
import { IChangePassword, IRefreshToken, IRegister, ISendOtpUsecase, ISignin, IVerifyOtp } from "../config/Dependency/auth/auth.di";

import { HttpStatusCode } from "../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../config/response-messages.constant";

import { useCaseResult } from "../application/shared/useCaseResult";
import { IAuthController } from "../interfaces/auth.controller.interface";


export class AuthController implements IAuthController {

    constructor(
        private sendOtpUsecase: ISendOtpUsecase,
        private verifyOtpUsecase: IVerifyOtp,
        private signinUsecase: ISignin,
        private registerUsecase: IRegister,
        private changePasswordUsecase: IChangePassword,
        private refreshTokenUsecase: IRefreshToken
    ) { }

    sendOtpToMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const email: string = req.body.email;

            const result: useCaseResult = await this.sendOtpUsecase.execute(email);
            if (!result.status) {
                res.status(HttpStatusCode.CONFLICT).json({ result });
                return;
            }

            res.status(200).json({ result });

        } catch (err) {
            next(err);
        }
    }


    validateOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {


        try {

            const email = req.body.email;
            const otpFromUser = req.body.otp + '';

            const isVerified = await this.verifyOtpUsecase.execute(email, otpFromUser);

            if (isVerified) {
                res.status(HttpStatusCode.OK).json({ message: RESPONSE_MESSAGES.AUTH.OTP_VALIDATED, status: true });
            } else {
                res.status(HttpStatusCode.NOT_FOUND).json({ message: RESPONSE_MESSAGES.AUTH.OTP_INVALID, status: false });
            }

        } catch (err) {

            next(err);
        }
    }


    signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { email, passWord } = req.body;

            const result = await this.signinUsecase.execute(email, passWord);
            if (!result.status) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS });
                return;
            }
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

            next(err)
        }
    }



    createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { email, companyName, passWord } = req.body;

            const registrationStatus = await this.registerUsecase.execute(email, companyName, passWord);
            if (!registrationStatus.status) {

                switch (registrationStatus.message) {

                    case 'Email already in use':
                        res.status(HttpStatusCode.CONFLICT).json({ status: false, message: 'Email already in use' });
                        return;
                    case 'Email already registered':
                        res.status(HttpStatusCode.CONFLICT).json({ status: false, message: 'Email already registered' });
                        return;
                    case 'Company couldnt create':
                        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Company couldnt create' });
                        return;
                    case 'Workspace probably have not created':
                        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Workspace probably have not created' });
                        return;
                    case 'Password couldnt secured':
                        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Password couldnt secured' });
                        return;
                    default:
                        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Unknown error on registration' });
                        return;
                }

            }

            res.status(HttpStatusCode.OK).json({ status: true, token: registrationStatus.token });
            return;

        } catch (err) {

            next(err)
        }
    }

    changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.changePasswordUsecase.execute(req.user.email, req.body.oldPassword, req.body.passWord);

            if (!result) {

                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Try again, default password might be wrong.' });
                return;
            };

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.COMMON.SUCCESS });
            return;
        } catch (err) {
            next(err);
        }
    }


    isVerified = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            if (req.user) {
                res.status(HttpStatusCode.OK).json({ status: true, user: req.user });
                return;
            } else {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false });
                return;
            }

        } catch (err) {

            next(err);
        }
    }


    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {


            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'No refresh token provided' });
                return
            }

            const result = await this.refreshTokenUsecase.execute(refreshToken);
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

            next(err);

        }
    }

}

