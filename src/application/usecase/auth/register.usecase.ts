import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import jwt from 'jsonwebtoken';
import { config } from "../../../config/config";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { useCaseResult } from "../../shared/useCaseResult";
import { Company } from "../../../infrastructure/database/models/company.interface";
import { IRegister } from "../../../config/Dependency/auth/auth.di";


export class RegisterUseCase implements IRegister {

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


            const [ownerRole, adminRole, developerRole] = await Promise.all([
                this.userRepo.createRole('Owner',
                    [
                        "create_task",
                        "view_task",
                        "edit_task",
                        "delete_task",
                        "assign_task",
                        "comment_task",

                        "create_project",
                        "view_project",
                        "edit_project",
                        "delete_project",

                        "invite_user",
                        "remove_user",
                        "assign_role",

                        "manage_billing"
                    ], '', companyIdStatus.additional),


                this.userRepo.createRole('Admin',
                    [
                        "create_task",
                        "view_task",
                        "edit_task",
                        "delete_task",
                        "assign_task",
                        "comment_task",

                        "create_project",
                        "view_project",
                        "edit_project",
                        "delete_project",

                        "invite_user",
                        "remove_user",
                        "assign_role"
                    ], '', companyIdStatus.additional),

                this.userRepo.createRole('Developer',
                    [
                        "view_task", "edit_task", "assign_task", "comment_task",
                    ], '', companyIdStatus.additional)
            ]);


            const hashedPassword = await this.securePassword.secure(passWord);
            if (!hashedPassword) return { status: false, message: 'Password couldnt secured' };

            const userData = await this.userRepo.createUser(
                email,
                companyName,
                hashedPassword,
                ownerRole._id as unknown as string,
                companyIdStatus.additional,
                workSpaceId,
                false,
                'company-user'
            );
            if (!userData) return { status: false, message: 'User Data not available' };
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
                        companyId: company._id,
                        systemRole: userData.systemRole

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