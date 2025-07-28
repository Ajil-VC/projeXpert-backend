import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { Company } from "../../../infrastructure/database/models/company.interface";


export class GetCompanySubscription {

    constructor(private companyRepo: ICompanyRepository) { }

    async execute(companyId: string): Promise<{ company: Company, isExpired: boolean }> {

        const company = await this.companyRepo.findCompanyById(companyId);
        if (!company?.currentPeriodEnd) {
            return { company, isExpired: true }
        }

        const currentDate = new Date();
        const endDate = new Date(company.currentPeriodEnd);
        const isExpired = endDate < currentDate;
        return { company, isExpired };
    }
} 