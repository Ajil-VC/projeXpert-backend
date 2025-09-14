import { IAdminInitUsecase } from "../../../config/Dependency/admin/adminInit.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";



export class AdminInitUseCase implements IAdminInitUsecase {

    constructor(private _adminRepo: IAdminRepository) { }
    async execute(limit: number, skip: number, searchTerm: string): Promise<{ companyData: any, totalPages: number }> {

        const result = await this._adminRepo.getAllCompanyDetails(limit, skip, searchTerm);
        return result;
    }
}