import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";



export class ChangePsdUseCase {

    constructor(private securePassWord: ISecurePassword, private authRepo: IAuthRepository, private userRepo: IUserRepository) { }

    async execute(email: string, oldPassword: string, passWord: string): Promise<boolean> {

        try {

            const userData = await this.userRepo.findByEmail(email);
            if (!userData) throw new Error('User not exist');

            const isOldPassWordTrue = await this.securePassWord.validatePassword(oldPassword, userData.password as string);

            if (!isOldPassWordTrue) {
                return false;
            }

            const hashedPassWord = await this.securePassWord.secure(passWord);
            if (!hashedPassWord) throw new Error('Password couldnt hashed');

            const result = this.authRepo.changePassword(email, hashedPassWord);
            if (!result) return false;
            return true;

        } catch (err) {
            console.error('Error occured while changing password', err);
            return false;
        }
    }
}