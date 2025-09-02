
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IAdminInitUse {
    execute(limit: number, skip: number, searchTerm: string): Promise<{ companyData: any, totalPages: number }>;
}

export interface IAdminData {
    execute(adminId: string): Promise<UserResponseDTO>;
}
