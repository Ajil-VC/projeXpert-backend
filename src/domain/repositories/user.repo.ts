
import { Attachment, User } from "../../infrastructure/database/models/user.interface";

export interface IUserRepository {

    updateUserProfile(file: Attachment | null, userId: string, name: string): Promise<User>;

    changeUserStatus(userId: string, status: boolean): Promise<any>;

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

    updateDefaultWorkspace(workspaceId: string, userId: string): Promise<User>;

}