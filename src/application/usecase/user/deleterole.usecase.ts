import { IDeleteRole } from "../../../config/Dependency/user/user.di";
import { IRoleRepository } from "../../../domain/repositories/role.repo";



export class DeleteRoleUsecase implements IDeleteRole {

    constructor(private roleRepo: IRoleRepository) { }

    async execute(roleId: string): Promise<boolean> {

        const result = await this.roleRepo.deleteRole(roleId);
        return result;
    }

}