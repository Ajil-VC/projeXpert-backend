import { ISecurePassword } from "../../domain/services/securepassword.interface";
import bcrypt from 'bcrypt';

export class SecurePasswordImp implements ISecurePassword {

    async validatePassword(passWord: string, ogPassWord: string): Promise<boolean> {

        const isPassWordValid = await bcrypt.compare(passWord, ogPassWord);
        if (isPassWordValid) return true;

        return false;
    }

    async secure(passWord: string): Promise<string | undefined> {

        try {

            const hashedP = await bcrypt.hash(passWord, 10);
            return hashedP;

        } catch (err) {
            console.error(`Something went wrong while securing password. ${err}`)
        }
    }
}