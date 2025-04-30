
import { User } from "../entities/user.interface";

export interface IUserRepository {

    findByEmail(email: string): Promise<User | null>

    createUser(
        email: string,
        userName: string,
        passWord: string | undefined,
        role: 'admin' | 'user',
        companyId: string,
        workspaceId: string,
        forceChangePassword: boolean,
        systemRole: 'platform-admin' | 'company-user'
    ): Promise<User | null>

    findUserById(userId: string): Promise<User | null>

    updateRole(members: Array<{ email: string, role: string }>, adminEmail: string): Promise<boolean>;

}