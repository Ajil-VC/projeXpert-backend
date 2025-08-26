import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";



export interface ICompanySubscriptionRepository {

    getMonthlySubscriptions(plans?: string[]): Promise<any>;

    subscriptionWithinTimeperiod(plans: string[], startDate?: Date | null, endDate?: Date | null): Promise<any>;

    getPlanUsage(): Promise<any>;

    top5Companies(): Promise<Array<{
        totalAmount: number,
        subscriptionCount: number,
        companyId: any,
        companyName: string
    }>>;

    getSubscriptionData(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>, totalPage: number }>;

}