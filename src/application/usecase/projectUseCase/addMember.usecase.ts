import { IUserRepository } from "../../../domain/repositories/user.repo";
import otpGenerator from 'otp-generator';
import { IEmailService } from "../../../domain/services/email.interface";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Project } from "../../../infrastructure/database/models/project.interface";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import { IAddMemberUsecase } from "../../../config/Dependency/user/project.di";
import { Company } from "../../../infrastructure/database/models/company.interface";

export class AddMemberUseCase implements IAddMemberUsecase {

    constructor(
        private _userRepo: IUserRepository,
        private _sendEmail: IEmailService,
        private _projectRepo: IProjectRepository,
        private _securePassword: ISecurePassword
    ) { }

    async execute(email: string, projectId: string, workSpaceId: string, companyId: string, roleId: string): Promise<Project | null> {

        const isUserExist = await this._userRepo.findByEmail(email);
        if (isUserExist && ((isUserExist.companyId as Company)._id.toString() !== companyId)) {
            throw new Error(`${isUserExist.email} is already linked to another company and can’t be added here.`);
        }
        if (!isUserExist && !roleId) {
            throw new Error('Need a role while adding new user.');
        }
        if (!isUserExist) {
            if (roleId === 'existing-member') {
                throw new Error('No user in that email. Add user by providing a role.');
            }
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: true,
                specialChars: false
            })
            const hashedPassword = await this._securePassword.secure(otp);
            console.log(`Current password of new User : ${otp}`);
            const createdUser = await this._userRepo.createUser(
                email,
                'New User',
                hashedPassword,
                roleId,
                companyId,
                workSpaceId, true, 'company-user');
            if (!createdUser) throw new Error('User couldnt create.');

            const isMailSent = await this._sendEmail.send(email, 'Projexpert Password', `Your password is: ${otp}`);
            if (!isMailSent) throw new Error(`Password couldnt send to the email ${email}`);

        }

        const updatedProject = await this._projectRepo.addMemberToProject(projectId, email, workSpaceId);
        if (!updatedProject) {
            throw new Error('Member not added');
        }
        return updatedProject;

    }
}