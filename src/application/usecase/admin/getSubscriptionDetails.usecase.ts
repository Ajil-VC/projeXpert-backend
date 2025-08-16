import { IGetSubscriptionAdmin } from "../../../config/Dependency/admin/comapanymanage.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { Company } from "../../../infrastructure/database/models/company.interface";


export class GetSubscriptions implements IGetSubscriptionAdmin {

    constructor(private adminRepo: IAdminRepository) { }

    async execute(): Promise<Company[]> {

        const companies = await this.adminRepo.getCopmaniesWithPlans();
        return companies;
    }
}