import { OtpRepoImp } from "../../../infrastructure/repositories/otp.repositoryImp";
import { IOtpRepository } from "../../../domain/repositories/otp.repo";

import { userRepositoryImp } from "../../../infrastructure/repositories/user.repositoryImp";
import { IUserRepository } from "../../../domain/repositories/user.repo";

import { EmailServiceImp } from "../../../infrastructure/services/email.serviceImp";
import { IEmailService } from "../../../domain/services/email.interface";

import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import { SecurePasswordImp } from "../../../infrastructure/services/securepassword.serviceImp";

import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/company.repositoryImp";

import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import { AuthRepositoryImp } from "../../../infrastructure/repositories/auth.repositoryImp";

import { SendOtpUseCase } from "../../../application/usecase/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../../../application/usecase/auth/VerifyOtp.usecase";
import { RegisterUseCase } from "../../../application/usecase/auth/register.usecase";
import { SigninUseCase } from "../../../application/usecase/auth/signin.usecase";
import { ChangePsdUseCase } from "../../../application/usecase/auth/changePswd.usecase";
import { RefreshTokenUseCase } from "../../../application/usecase/auth/refreshToken.usecase";
import { IsCompanyBlockedUsecase } from "../../../application/usecase/auth/isCompanyBlocked.usecase";
import { IsUserBlockedUsecase } from "../../../application/usecase/auth/isUserBloced.usecase";

const otpRepository: IOtpRepository = new OtpRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();
const emailService: IEmailService = new EmailServiceImp();
const securePassword: ISecurePassword = new SecurePasswordImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const authRepository: IAuthRepository = new AuthRepositoryImp();

export const isUserBlocked = new IsUserBlockedUsecase(userRepository);
export const isCompanyBlocked = new IsCompanyBlockedUsecase(companyRepository);
export const sendOtpUsecase = new SendOtpUseCase(userRepository, otpRepository, emailService);
export const verifyOtpUsecase = new VerifyOtpUseCase(otpRepository);
export const signinUsecase = new SigninUseCase(userRepository, securePassword);
export const registerUsecase = new RegisterUseCase(securePassword, userRepository, companyRepository);
export const changePasswordUsecase = new ChangePsdUseCase(securePassword, authRepository, userRepository);
export const refreshTokenUsecase = new RefreshTokenUseCase(userRepository);