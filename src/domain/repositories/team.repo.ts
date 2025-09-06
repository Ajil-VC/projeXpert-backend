import { User } from "../../infrastructure/database/models/user.interface";


export interface ITeamRepository {

    getTeamMembers(projectId: string | null, userId: string): Promise<Array<any>>;

    getCompanyUsers(
        companyId: string,
        pageNum?: number | null,
        limit?: number,
        skip?: number,
        userId?: string,
        searchTerm?: string,
        role?: string,
        status?: boolean | null
    ): Promise<{
        users: User[], totalPages: number
    }>;

    updateUserRoleAndStatus(userId: string, userRole: string, status: boolean | null): Promise<User>;

}