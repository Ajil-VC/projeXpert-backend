import { Subscription } from "../../infrastructure/database/models/subscription.interface";


export interface ISubscription {

    createSubscription(companyId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        plan: 'Pro' | 'Enterprise',
        status: string,
        billingCycle: 'month' | 'year',
        currentPeriodEnd: Date
    ): Promise<Subscription>;


    getSubscriptions(companyId: string | null): Promise<Subscription | Subscription[] | null>;
}