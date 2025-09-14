import { IGetSubscriptionAdminUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";


export class GetSubscriptions implements IGetSubscriptionAdminUsecase {

    constructor(private _companySubscriptionRepo: ICompanySubscriptionRepository) { }

    async execute(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>, totalPage: number }> {

        const data = await this._companySubscriptionRepo.getSubscriptionData(searchTerm, sort, limit, skip);
        return data;

    }
}