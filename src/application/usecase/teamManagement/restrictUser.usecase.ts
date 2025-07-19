import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { UserMapper } from "../../../mappers/user/user.mapper";




export class RestrictUser {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(userId: string, status: boolean | null, userRole: string): Promise<UserResponseDTO> {

        const result = await this.teamRepo.restrictUser(userId, status, userRole);
        return UserMapper.toResponseDTO(result);
    }
}