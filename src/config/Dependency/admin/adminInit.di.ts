
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IAdminInitUse {
    execute(): Promise<any>;
}

export interface IAdminData {
    execute(adminId: string): Promise<UserResponseDTO>;
}
