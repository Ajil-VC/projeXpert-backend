import { IGetCompanyUsers } from "../../../config/Dependency/user/team.di";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { User } from "../../../infrastructure/database/models/user.interface";
import { UserMapper } from "../../../mappers/user/user.mapper";



export class GetUsersInCompany implements IGetCompanyUsers {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(
        companyId: string,
        pageNum: number | null,
        limit: number,
        skip: number,
        userId: string,
        searchTerm: string,
        role: string,
        status: boolean | null
    ): Promise<{ users: UserResponseDTO[], totalPages: number }> {

        const result = await this.teamRepo.getCompanyUsers(companyId, pageNum, limit, skip, userId, searchTerm, role, status);

        return { users: result.users.map(UserMapper.toResponseDTO), totalPages: result.totalPages };
    }
}