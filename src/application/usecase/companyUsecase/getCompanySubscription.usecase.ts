import { ICompanySubscriptionUsecase } from "../../../config/Dependency/user/subscription.di";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { Company } from "../../../infrastructure/database/models/company.interface";


export class GetCompanySubscription implements ICompanySubscriptionUsecase {

    constructor(private _companyRepo: ICompanyRepository) { }

    async execute(companyId: string): Promise<{ company: Company, isExpired: boolean }> {

        const company = await this._companyRepo.findCompanyById(companyId);
        const currentDate = new Date();

        if (!company?.currentPeriodEnd || !company.plan) {
            return { company, isExpired: true };
        }

        const endDate = company.currentPeriodEnd;

        const isExpired = endDate < currentDate;
        return { company, isExpired };
    }
} 