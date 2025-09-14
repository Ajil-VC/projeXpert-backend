import { IGetRoleWithIdUsecase } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class CanMutateRoleUsecase implements IGetRoleWithIdUsecase {

    constructor(private _roleRepo: IRoleRepository) {

    }

    async execute(roleId: string): Promise<Roles> {

        const canMutate = await this._roleRepo.getRoleWithId(roleId);
        return canMutate;

    }

}