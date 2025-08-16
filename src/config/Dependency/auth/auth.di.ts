import { OtpRepoImp } from "../../../infrastructure/repositories/repoImplementations/otp.repositoryImp";
import { IOtpRepository } from "../../../domain/repositories/otp.repo";

import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { IUserRepository } from "../../../domain/repositories/user.repo";

import { EmailServiceImp } from "../../../infrastructure/services/email.serviceImp";
import { IEmailService } from "../../../domain/services/email.interface";

import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import { SecurePasswordImp } from "../../../infrastructure/services/securepassword.serviceImp";

import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";

import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import { AuthRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/auth.repositoryImp";

import { SendOtpUseCase } from "../../../application/usecase/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../../../application/usecase/auth/VerifyOtp.usecase";
import { RegisterUseCase } from "../../../application/usecase/auth/register.usecase";
import { SigninUseCase } from "../../../application/usecase/auth/signin.usecase";
import { ChangePsdUseCase } from "../../../application/usecase/auth/changePswd.usecase";
import { RefreshTokenUseCase } from "../../../application/usecase/auth/refreshToken.usecase";
import { IsCompanyBlockedUsecase } from "../../../application/usecase/auth/isCompanyBlocked.usecase";
import { IsUserBlockedUsecase } from "../../../application/usecase/auth/isUserBloced.usecase";
import { useCaseResult } from "../../../application/shared/useCaseResult";


export interface ISendOtpUsecase {
    execute(email: string): Promise<useCaseResult>
}

export interface IVerifyOtp {
    execute(email: string, otp: string): Promise<boolean>
}

export interface ISignin {
    execute(email: string, passWord: string): Promise<useCaseResult>
}

export interface IRegister {
    execute(email: string, companyName: string, passWord: string): Promise<useCaseResult>;
}

export interface IChangePassword {
    execute(email: string, oldPassword: string, passWord: string): Promise<boolean>
}

export interface IRefreshToken {
    execute(refreshToken: string): Promise<useCaseResult>;
}