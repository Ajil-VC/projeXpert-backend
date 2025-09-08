import { ChangePsdUseCase } from "../../application/usecase/auth/changePswd.usecase";
import { IsCompanyBlockedUsecase } from "../../application/usecase/auth/isCompanyBlocked.usecase";
import { IsUserBlockedUsecase } from "../../application/usecase/auth/isUserBloced.usecase";
import { RefreshTokenUseCase } from "../../application/usecase/auth/refreshToken.usecase";
import { RegisterUseCase } from "../../application/usecase/auth/register.usecase";
import { SendOtpUseCase } from "../../application/usecase/auth/sendOtp.usecase";
import { SigninUseCase } from "../../application/usecase/auth/signin.usecase";
import { VerifyOtpUseCase } from "../../application/usecase/auth/VerifyOtp.usecase";
import { AuthController } from "../../controllers/authController";
import { IAuthRepository } from "../../domain/repositories/auth.repo";
import { ICompanyRepository } from "../../domain/repositories/company.repo";
import { IOtpRepository } from "../../domain/repositories/otp.repo";
import { IRoleRepository } from "../../domain/repositories/role.repo";
import { IUserRepository } from "../../domain/repositories/user.repo";
import { IEmailService } from "../../domain/services/email.interface";
import { ISecurePassword } from "../../domain/services/securepassword.interface";
import { AuthRepositoryImp } from "../../infrastructure/repositories/repoImplementations/auth.repositoryImp";
import { CompanyRepositoryImp } from "../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { OtpRepoImp } from "../../infrastructure/repositories/repoImplementations/otp.repositoryImp";
import { RoleRepositoryImp } from "../../infrastructure/repositories/repoImplementations/role.repositoryImp";
import { userRepositoryImp } from "../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { EmailServiceImp } from "../../infrastructure/services/email.serviceImp";
import { SecurePasswordImp } from "../../infrastructure/services/securepassword.serviceImp";
import { IAuthController } from "../../interfaces/auth.controller.interface";


const otpRepository: IOtpRepository = new OtpRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();
const emailService: IEmailService = new EmailServiceImp();
const securePassword: ISecurePassword = new SecurePasswordImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const authRepository: IAuthRepository = new AuthRepositoryImp();
const roleRepository: IRoleRepository = new RoleRepositoryImp();

export const isUserBlocked = new IsUserBlockedUsecase(userRepository);
export const isCompanyBlocked = new IsCompanyBlockedUsecase(companyRepository);

export const sendOtpUsecase = new SendOtpUseCase(userRepository, otpRepository, emailService);

export const verifyOtpUsecase = new VerifyOtpUseCase(otpRepository);
export const signinUsecase = new SigninUseCase(userRepository, securePassword);
export const registerUsecase = new RegisterUseCase(securePassword, userRepository, companyRepository, roleRepository);
export const changePasswordUsecase = new ChangePsdUseCase(securePassword, authRepository, userRepository);
export const refreshTokenUsecase = new RefreshTokenUseCase(userRepository);

export const authInterface: IAuthController = new AuthController(
    sendOtpUsecase,
    verifyOtpUsecase,
    signinUsecase,
    registerUsecase,
    changePasswordUsecase,
    refreshTokenUsecase
);
