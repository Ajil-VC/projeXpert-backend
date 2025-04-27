import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";



export class ChangePsdUseCase {

    constructor(private securePassWord: ISecurePassword, private authRepo: IAuthRepository) { }

    async execute(email: string, passWord: string): Promise<boolean> {

        try {

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