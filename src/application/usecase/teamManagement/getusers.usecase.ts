import { IGetCompanyUsersUsecase } from "../../../config/Dependency/user/team.di";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { UserMapper } from "../../../mappers/user/user.mapper";



export class GetUsersInCompany implements IGetCompanyUsersUsecase {

    constructor(private _teamRepo: ITeamRepository) { }

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

        const result = await this._teamRepo.getCompanyUsers(companyId, pageNum, limit, skip, userId, searchTerm, role, status);

        return { users: result.users.map(UserMapper.toResponseDTO), totalPages: result.totalPages };
    }
}