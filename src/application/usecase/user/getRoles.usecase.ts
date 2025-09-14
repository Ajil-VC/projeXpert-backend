import { IGetRolesUsecase } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class GetRoles implements IGetRolesUsecase {
    constructor(private _roleRepo: IRoleRepository) { }

    async execute(companyId: string): Promise<Array<Roles>> {

        const roles = await this._roleRepo.getRoles(companyId);
        return roles;

    }
}