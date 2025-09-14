import { IAdminDataUsecase } from "../../../config/Dependency/admin/adminInit.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { UserMapper } from "../../../mappers/user/user.mapper";


export class GetAdminUseCase implements IAdminDataUsecase {

    constructor(private _adminRepo: IAdminRepository) { }
    async execute(adminId: string): Promise<UserResponseDTO> {

        const result = await this._adminRepo.getAdmin(adminId);
        return UserMapper.toResponseDTO(result);
    }
}