import { IGetRoles } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class GetRoles implements IGetRoles {
    constructor(private roleRepo: IRoleRepository) { }

    async execute(companyId: string): Promise<Array<Roles>> {

        const roles = await this.roleRepo.getRoles(companyId);
        return roles;

    }
}