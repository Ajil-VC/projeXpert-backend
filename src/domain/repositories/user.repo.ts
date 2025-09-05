
import { Permissions, Roles } from "../../infrastructure/database/models/role.interface";
import { Attachment, User } from "../../infrastructure/database/models/user.interface";

export interface IUserRepository {

    getRoles(companyId: string): Promise<Array<Roles>>;

    createRole(roleName: string, permissions: Array<Permissions>, description: string, companyId: string): Promise<Roles>;

    updateUserProfile(file: Attachment | null, userId: string, name: string): Promise<User>;

    changeUserStatus(userId: string, status: boolean): Promise<any>;

    findByEmail(email: string): Promise<User | null>

    createUser(
        email: string,
        userName: string,
        passWord: string | undefined,
        role: string,
        companyId: string,
        workspaceId: string,
        forceChangePassword: boolean,
        systemRole: 'platform-admin' | 'company-user'
    ): Promise<User | null>

    findUserById(userId: string): Promise<User | null>

    updateRole(members: Array<{ email: string, role: string }>, adminEmail: string): Promise<boolean>;

    updateDefaultWorkspace(workspaceId: string, userId: string): Promise<User>;

    largestEmployer(): Promise<Array<{
        employerCount: number,
        email: string,
        companyName: string
    }>>;

}