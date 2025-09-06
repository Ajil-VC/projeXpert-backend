import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import { useCaseResult } from "../../shared/useCaseResult";
import { config } from "../../../config/config";
import jwt from 'jsonwebtoken';
import { Company } from "../../../infrastructure/database/models/company.interface";
import { ISignin } from "../../../config/Dependency/auth/auth.di";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class SigninUseCase implements ISignin {

    constructor(
        private userRepo: IUserRepository,
        private vPassword: ISecurePassword
    ) { }

    async execute(email: string, passWord: string): Promise<useCaseResult> {

        const userData = await this.userRepo.findByEmail(email);
        if (!userData) {
            return { status: false, message: 'Invalid credentials.', statusCode: 400 };
        }

        const isPassWordValid = await this.vPassword.validatePassword(passWord, userData?.password as string);

        if (!isPassWordValid) {
            return { status: false, message: 'Invalid Credentials', statusCode: 400 }
        }


        if (!config.JWT_SECRETKEY) {
            throw new Error('JWT secret key is not defined.');
        }


        let company = null;
        if (userData.systemRole === 'company-user') {
            company = (userData.companyId as Company)._id;
        }
        const token = jwt.sign(
            {
                id: userData._id,
                email: userData.email,
                name: userData.name,
                role: (userData.role as unknown as Roles),
                isBlocked: userData.isBlocked,
                companyId: company,
                systemRole: userData.systemRole
            },
            config.JWT_SECRETKEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: userData._id },
            config.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )

        return {
            status: true,
            message: 'Token Created',
            statusCode: 200,
            token: token,
            additional: userData,
            refreshToken
        };
    }
}