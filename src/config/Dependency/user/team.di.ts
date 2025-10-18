
import { Team } from "../../../infrastructure/database/models/team.interface";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IGetTeamMembersUsecase {
    execute(projectId: string | null, userId: string): Promise<Team[]>;
}

export interface IGetCompanyUsersUsecase {
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

export interface IUpdateUserRoleAndStatusUsecase {
    execute(userId: string, userRole: string, status: boolean | null): Promise<UserResponseDTO>;
}