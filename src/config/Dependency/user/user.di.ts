
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { Permissions, Roles } from "../../../infrastructure/database/models/role.interface";

export interface IUpdateProfileUsecase {
    execute(file: Express.Multer.File, userId: string, name: string): Promise<UserResponseDTO>;
}

export interface ICreateRoleUsecase {
    execute(roleName: string, permissions: Array<Permissions>, description: string, companyId: string): Promise<Roles>;
}

export interface IGetRolesUsecase {
    execute(companyId: string): Promise<Array<Roles>>;
}

export interface IDeleteRoleUsecase {
    execute(roleId: string): Promise<boolean>;
}

export interface IGetRoleWithIdUsecase {
    execute(roleId: string): Promise<Roles>;
}

export interface IUpdateRoleUsecase {
    execute(roleName: string, permissions: Array<Permissions>, description: string, roleId: string): Promise<Roles>;
}