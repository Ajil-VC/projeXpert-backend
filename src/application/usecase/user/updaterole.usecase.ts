import { IUpdateRoleUsecase } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Permissions, Roles } from "../../../infrastructure/database/models/role.interface";


export class UpdateRoleUsecase implements IUpdateRoleUsecase {

    constructor(private _roleRepo: IRoleRepository) { }

    async execute(roleName: string, permissions: Array<Permissions>, description: string, roleId: string): Promise<Roles> {

        const result = await this._roleRepo.updateRole(roleName, permissions, description, roleId);
        return result;

    }

}