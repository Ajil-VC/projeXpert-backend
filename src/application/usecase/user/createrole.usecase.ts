import { ICreateRole } from "../../../config/Dependency/user/user.di";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { Permissions, Roles } from "../../../infrastructure/database/models/role.interface";


export class CreateRoleUsecase implements ICreateRole {
    constructor(private userRepo: IUserRepository) { }


    async execute(roleName: string, permissions: Array<Permissions>, description: string, companyId: string): Promise<Roles> {

        const newRole = await this.userRepo.createRole(roleName, permissions, description, companyId);
        return newRole;
    }
}