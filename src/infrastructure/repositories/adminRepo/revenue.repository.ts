import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { IRevenueRepository } from "../../../domain/repositories/adminRepo/revenue.repo";


export class RevenueRepositoryImp implements IRevenueRepository {

    constructor(private companySubscriptionRepo: ICompanySubscriptionRepository) { }

    async getRevenueReport(filter: 'year' | 'month' | 'date' | null, plans: string[], startDate: Date | null, endDate: Date | null): Promise<any> {

        if (startDate && endDate) {
            const data = await this.companySubscriptionRepo.subscriptionWithinTimeperiod(plans, startDate, endDate);
            if (!data) {
                throw new Error('Couldnt retrieve data.');
            }
            return data;
        } else if (filter) {
            if (filter === 'month') {

                const subscriptionsMonth = await this.companySubscriptionRepo.subscriptionWithinTimeperiod(plans);
                if (!subscriptionsMonth) {
                    throw new Error('Couldnt retrieve data.');
                }
                return subscriptionsMonth;

            } else if (filter === 'year') {

                const subscriptionsYear = await this.companySubscriptionRepo.getMonthlySubscriptions(plans);
                if (!subscriptionsYear) {
                    throw new Error('Couldnt retrieve data.');
                }
                return subscriptionsYear;

            }
        }

    }

}