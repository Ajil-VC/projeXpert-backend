import { IChangePasswordUsecase } from "../../../config/Dependency/auth/auth.di";
import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";



export class ChangePsdUseCase implements IChangePasswordUsecase {

    constructor(private _securePassWord: ISecurePassword, private _authRepo: IAuthRepository, private _userRepo: IUserRepository) { }

    async execute(email: string, oldPassword: string, passWord: string): Promise<boolean> {

        try {

            const userData = await this._userRepo.findByEmail(email);
            if (!userData) throw new Error('User not exist');

            const isOldPassWordTrue = await this._securePassWord.validatePassword(oldPassword, userData.password as string);

            if (!isOldPassWordTrue) {
                return false;
            }

            const hashedPassWord = await this._securePassWord.secure(passWord);
            if (!hashedPassWord) throw new Error('Password couldnt hashed');

            const result = this._authRepo.changePassword(email, hashedPassWord);
            if (!result) return false;
            return true;

        } catch (err) {
            console.error('Error occured while changing password', err);
            return false;
        }
    }
}