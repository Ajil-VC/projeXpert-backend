import { IGetSubscriptionAdmin } from "../../../config/Dependency/admin/comapanymanage.di";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";


export class GetSubscriptions implements IGetSubscriptionAdmin {

    constructor(private companySubscriptionRepo: ICompanySubscriptionRepository) { }

    async execute(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>, totalPage: number }> {

        const data = await this.companySubscriptionRepo.getSubscriptionData(searchTerm, sort, limit, skip);
        return data;

    }
}