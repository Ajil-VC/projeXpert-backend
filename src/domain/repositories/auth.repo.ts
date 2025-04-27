

export interface IAuthRepository {

    changePassword(email: string, passWord: string): Promise<any>;
}