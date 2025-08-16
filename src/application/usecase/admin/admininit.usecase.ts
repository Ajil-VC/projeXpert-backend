import { IAdminInitUse } from "../../../config/Dependency/admin/adminInit.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";



export class AdminInitUseCase implements IAdminInitUse {

    constructor(private adminRepo: IAdminRepository) { }
    async execute(): Promise<any> {

        const result = await this.adminRepo.getAllCompanyDetails();
        return result;
    }
}