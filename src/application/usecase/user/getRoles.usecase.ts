import { IGetRoles } from "../../../config/Dependency/user/user.di";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { Roles } from "../../../infrastructure/database/models/role.interface";


export class GetRoles implements IGetRoles {
    constructor(private userRepo: IUserRepository) { }

    async execute(companyId: string): Promise<Array<Roles>> {

        const roles = await this.userRepo.getRoles(companyId);
        return roles;

    }
}