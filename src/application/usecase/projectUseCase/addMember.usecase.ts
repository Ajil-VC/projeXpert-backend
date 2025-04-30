import { IUserRepository } from "../../../domain/repositories/user.repo";
import otpGenerator from 'otp-generator';
import { IEmailService } from "../../../domain/services/email.interface";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Project } from "../../../domain/entities/project.interface";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";

export class AddMemberUseCase {

    constructor(
        private userRepo: IUserRepository,
        private sendEmail: IEmailService,
        private projectRepo: IProjectRepository,
        private securePassword: ISecurePassword
    ) { }

    async execute(email: string, projectId: string, workSpaceId: string, companyId: string): Promise<Project | null> {

        const isUserExist = await this.userRepo.findByEmail(email);
        if (!isUserExist) {

            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: true,
                specialChars: false
            })
            const hashedPassword = await this.securePassword.secure(otp);
            console.log(`Current password of new User : ${otp}`);
            const createdUser = await this.userRepo.createUser(email, 'New User', hashedPassword, 'user', companyId, workSpaceId, true, 'company-user');
            if (!createdUser) throw new Error('User couldnt create.');

            const isMailSent = await this.sendEmail.send(email, 'Projexpert Password', `Your password is: ${otp}`);
            if (!isMailSent) throw new Error(`Password couldnt send to the email ${email}`);

        }

        const updatedProject = await this.projectRepo.addMemberToProject(projectId, email);
        if (!updatedProject) return null;
        return updatedProject;

    }
}