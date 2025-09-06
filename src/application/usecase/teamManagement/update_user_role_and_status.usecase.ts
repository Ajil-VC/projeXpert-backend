import { IUpdateUserRoleAndStatus } from "../../../config/Dependency/user/team.di";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { UserMapper } from "../../../mappers/user/user.mapper";




export class UpdateUserRoleUseCase implements IUpdateUserRoleAndStatus {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(userId: string, userRole: string, status: boolean | null): Promise<UserResponseDTO> {

        const result = await this.teamRepo.updateUserRoleAndStatus(userId, userRole, status);
        return UserMapper.toResponseDTO(result);
    }
}