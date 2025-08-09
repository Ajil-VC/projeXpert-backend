import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { IAdminDashboardRepository } from "../../../domain/repositories/adminRepo/dashboard.repo";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";



export class DashboardRepositoryImp implements IAdminDashboardRepository {


    constructor(
        private companySubscriptionRepo: ICompanySubscriptionRepository,
        private companyRepo: ICompanyRepository
    ) { }

    async getAdminDashboardView(): Promise<any> {

        const [
            activeCompanySubscriptions,
            companyCount,
            subscriptions,
            planUsage
        ] = await Promise.all([
            this.companyRepo.activeCompanySubscriptions(),
            this.companyRepo.getTotalCompanyCountWithLastJoined(),
            this.companySubscriptionRepo.getMonthlySubscriptions(),
            this.companySubscriptionRepo.getPlanUsage()
        ]);

        return {
            activeCompanySubscriptions,
            companyCount,
            subscriptions,
            planUsage
        }
    }

}