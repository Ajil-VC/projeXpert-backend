import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";



export interface ICompanySubscriptionRepository {

    getMonthlySubscriptions(): Promise<any>;

    getPlanUsage(): Promise<any>;
}