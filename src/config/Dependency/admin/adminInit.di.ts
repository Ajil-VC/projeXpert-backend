
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IAdminInitUsecase {
    execute(limit: number, skip: number, searchTerm: string): Promise<{ companyData: any, totalPages: number }>;
}

export interface IAdminDataUsecase {
    execute(adminId: string): Promise<UserResponseDTO>;
}
