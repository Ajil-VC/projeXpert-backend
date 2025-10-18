
import { AdminInitDTO } from "../../../application/DTO/adminInitDTO";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IAdminInitUsecase {
    execute(limit: number, skip: number, searchTerm: string): Promise<AdminInitDTO>;
}

export interface IAdminDataUsecase {
    execute(adminId: string): Promise<UserResponseDTO>;
}
