import { IDeleteRoleUsecase } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";



export class DeleteRoleUsecase implements IDeleteRoleUsecase {

    constructor(private _roleRepo: IRoleRepository) { }

    async execute(roleId: string): Promise<boolean> {

        const result = await this._roleRepo.deleteRole(roleId);
        return result;
    }

}