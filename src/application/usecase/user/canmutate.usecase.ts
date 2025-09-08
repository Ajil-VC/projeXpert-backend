import { IGetRoleWithId } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class CanMutateRoleUsecase implements IGetRoleWithId {

    constructor(private roleRepo: IRoleRepository) {

    }

    async execute(roleId: string): Promise<Roles> {

        const canMutate = await this.roleRepo.getRoleWithId(roleId);
        return canMutate;

    }

}