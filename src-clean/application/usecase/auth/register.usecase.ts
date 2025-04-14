import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import jwt from 'jsonwebtoken';
import { config } from "../../../config/config";


export class RegisterUseCase {

    constructor(
        private securePassword: ISecurePassword,
        private userRepo: IUserRepository
    ) { }

    async execute(email: string, userName: string, passWord: string) {

        const hashedPassword = await this.securePassword.secure(passWord);

        const data = await this.userRepo.createUser(email, userName, hashedPassword);

        if (data) {

            if (!config.JWT_SECRETKEY) {
                throw new Error('JWT secret key is not defined.');
            }

            const token = jwt.sign(
                {
                    id: data.user._id,
                    email: data.user.email,
                    name: data.user.name,
                    role: data.user.role
                },
                config.JWT_SECRETKEY,
                { expiresIn: '1h' }
            )

            return { token, data }

        }

        return false;

    }
}