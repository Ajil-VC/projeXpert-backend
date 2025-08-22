import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";



export interface ICompanySubscriptionRepository {

    getMonthlySubscriptions(): Promise<any>;

    getPlanUsage(): Promise<any>;

    top5Companies(): Promise<Array<{
        totalAmount: number,
        subscriptionCount: number,
        companyId: any,
        companyName: string
    }>>;
}