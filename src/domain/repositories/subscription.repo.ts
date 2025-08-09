import { companySubscription } from "../../infrastructure/database/models/companySubscription.interface";
import { Subscription } from "../../infrastructure/database/models/subscription.interface";


export interface ISubscription {

    addSubscriptionToCompany(companyId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        status: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription>;

    createSubscriptionForCompany(
        companyId: string,
        plan: string,
        currentPeriodEnd: Date,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string
    ): Promise<companySubscription>;

    getPlan(priceId: string): Promise<Subscription>;

    getAllPlans(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }>;

}