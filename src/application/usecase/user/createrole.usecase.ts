import { ICreateRole } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Permissions, Roles } from "../../../infrastructure/database/models/role.interface";


export class CreateRoleUsecase implements ICreateRole {
    constructor(private roleRepo: IRoleRepository) { }


    async execute(roleName: string, permissions: Array<Permissions>, description: string, companyId: string): Promise<Roles> {

        const newRole = await this.roleRepo.createRole(roleName, permissions, description, companyId);
        return newRole;
    }
}