
import { Team } from "../../../infrastructure/database/models/team.interface";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IGetTeamMembers {
    execute(projectId: string | null, userId: string): Promise<Array<Team>>;
}

export interface IGetCompanyUsers {
    execute(
        companyId: string,
        pageNum: number | null,
        limit: number,
        skip: number,
        userId: string,
        searchTerm: string,
        role: string,
        status: boolean | null
    ): Promise<{ users: UserResponseDTO[], totalPages: number }>
}

export interface IUpdateUserRoleAndStatus {
    execute(userId: string, userRole: string, status: boolean | null): Promise<UserResponseDTO>;
}