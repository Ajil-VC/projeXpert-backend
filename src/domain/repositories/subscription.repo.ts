import { Subscription } from "../../infrastructure/database/models/subscription.interface";


export interface ISubscription {

    createSubscription(companyId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        status: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription>;

    getPlan(priceId: string): Promise<Subscription>;

    getAllPlans(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }>;
}