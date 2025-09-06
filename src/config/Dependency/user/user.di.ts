
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { Permissions, Roles } from "../../../infrastructure/database/models/role.interface";

export interface IUpdateProfile {
    execute(file: Express.Multer.File, userId: string, name: string): Promise<UserResponseDTO>;
}

export interface ICreateRole {
    execute(roleName: string, permissions: Array<Permissions>, description: string, companyId: string): Promise<Roles>;
}

export interface IGetRoles {
    execute(companyId: string): Promise<Array<Roles>>;
}