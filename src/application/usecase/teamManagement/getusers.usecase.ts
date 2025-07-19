import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { User } from "../../../infrastructure/database/models/user.interface";
import { UserMapper } from "../../../mappers/user/user.mapper";



export class GetUsersInCompany {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(companyId: string): Promise<UserResponseDTO[]> {

        const result = await this.teamRepo.getCompanyUsers(companyId);
        return result.map(UserMapper.toResponseDTO);
    }
}