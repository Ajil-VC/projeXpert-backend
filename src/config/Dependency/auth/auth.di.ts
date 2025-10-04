

import { useCaseResult } from "../../../application/shared/useCaseResult";


export interface ISendOtpUsecase {
    execute(email: string): Promise<useCaseResult>
}

export interface IVerifyOtpUsecase {
    execute(email: string, otp: string): Promise<boolean>
}

export interface ISigninUsecase {
    execute(email: string, passWord: string): Promise<useCaseResult>
}

export interface IRegisterUsecase {
    execute(email: string, companyName: string, passWord: string): Promise<useCaseResult>;
}

export interface IChangePasswordUsecase {
    execute(email: string, oldPassword: string, passWord: string): Promise<boolean>
}

export interface IRefreshTokenUsecase {
    execute(refreshToken: string): Promise<useCaseResult>;
}