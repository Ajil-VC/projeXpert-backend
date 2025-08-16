import { IAdminData } from "../../../config/Dependency/admin/adminInit.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { User } from "../../../infrastructure/database/models/user.interface";
import { UserMapper } from "../../../mappers/user/user.mapper";


export class GetAdminUseCase implements IAdminData {

    constructor(private adminRepo: IAdminRepository) { }
    async execute(adminId: string): Promise<UserResponseDTO> {

        const result = await this.adminRepo.getAdmin(adminId);
        return UserMapper.toResponseDTO(result);
    }
}