import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Company } from "../../../infrastructure/database/models/company.interface";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";




export class GetSubscriptions {

    constructor(private adminRepo: IAdminRepository) { }

    async execute(): Promise<Company[]> {

        const companies = await this.adminRepo.getCopmaniesWithPlans();
        return companies;
    }
}