
import { LargestEmployerDTO } from "../../application/DTO/adminDashboardDTO";
import { Attachment, User, UserDeepPopulated } from "../../infrastructure/database/models/user.interface";

export interface IUserRepository {

    updateUserProfile(file: Attachment | null, userId: string, name: string): Promise<User>;

    changeUserStatus(userId: string, status: boolean): Promise<boolean>;

    findByEmail(email: string): Promise<UserDeepPopulated | null>

    createUser(
        email: string,
        userName: string,
        passWord: string | undefined,
        roleId: string,
        companyId: string,
        workspaceId: string,
        forceChangePassword: boolean,
        systemRole: 'platform-admin' | 'company-user',

    ): Promise<User | null>

    findUserById(userId: string): Promise<UserDeepPopulated | null>

    updateRole(members: Array<{ email: string, role: string }>, adminEmail: string): Promise<boolean>;

    updateDefaultWorkspace(workspaceId: string, userId: string): Promise<User>;

    largestEmployer(): Promise<Array<LargestEmployerDTO>>;

}