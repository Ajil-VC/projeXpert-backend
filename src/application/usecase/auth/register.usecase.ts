import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import jwt from 'jsonwebtoken';
import { config } from "../../../config/config";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { useCaseResult } from "../../shared/useCaseResult";
import { Company } from "../../../domain/entities/company.interface";


export class RegisterUseCase {

    constructor(
        private securePassword: ISecurePassword,
        private userRepo: IUserRepository,
        private companyRepo: ICompanyRepository
    ) { }

    async execute(email: string, companyName: string, passWord: string): Promise<useCaseResult> {

        try {

            const isUserExists = await this.userRepo.findByEmail(email);
            if (isUserExists) return { status: false, message: 'Email already in use' };

            const isCompanyExist = await this.companyRepo.findCompanyByEmail(email);
            if (isCompanyExist) return { status: false, message: 'Email already registered' };

            const companyIdStatus = await this.companyRepo.createCompany(companyName, email);

            if (typeof companyIdStatus == 'string') return { status: false, message: 'Company couldnt create' };
            let workSpaceId = await this.companyRepo.createWorkspace('Default', companyIdStatus.additional);
            if (!workSpaceId || typeof workSpaceId !== 'string') return { status: false, message: 'Workspace probably have not created' };

            const hashedPassword = await this.securePassword.secure(passWord);
            if (!hashedPassword) return { status: false, message: 'Password couldnt secured' };

            const userData = await this.userRepo.createUser(
                email, 
                companyName, 
                hashedPassword, 
                'admin', 
                companyIdStatus.additional, 
                workSpaceId,
                false
            );
            if(!userData) return { status: false, message: 'UUser Data not available' };
            const company = userData.companyId as Company;
            if (userData) {

                if (!config.JWT_SECRETKEY) {
                    throw new Error('JWT secret key is not defined.');
                }

                const token = jwt.sign(
                    {
                        id: userData._id,
                        email: userData.email,
                        userName: userData.name,
                        role: userData.role,
                        companyId: company._id

                    },
                    config.JWT_SECRETKEY,
                    { expiresIn: '1h' }
                )

                return { status: true, token, message: 'Company Registered Successfully', additional: userData };

            }

            // If it reaches here we can revert the operations(Only optional).
            return { status: true, message: 'Company Registration failed.' };

        } catch (err) {
            console.error('Something went wrong while registering the company.', err);
            return { status: false, message: 'Unknown_Error' };
        }


    }
}