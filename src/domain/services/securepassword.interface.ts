

export interface ISecurePassword {

    secure(passWord: string): Promise<string | undefined>;
    validatePassword(passWord: string, ogPassWord: string): Promise<boolean>;
}