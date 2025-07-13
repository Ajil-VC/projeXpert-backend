import { IAuthRepository } from "../../../domain/repositories/auth.repo";
import userModel from "../../database/user.models";


export class AuthRepositoryImp implements IAuthRepository {

    async changePassword(email: string, passWord: string): Promise<any> {

        const result = await userModel.updateOne({ email: email }, { $set: { password: passWord, forceChangePassword: false } }).exec();
        if (!result.acknowledged) throw new Error('Password couldnt change due to internal error');

        return result.acknowledged;
    }

}