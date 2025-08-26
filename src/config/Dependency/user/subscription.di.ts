
import { Company } from "../../../infrastructure/database/models/company.interface";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";

export interface ISubscribe {
    execute(
        ownerEmail: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription>
}

export interface IGetSubscription {
    execute(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }>
}

export interface IIsPlanAvailable {
    execute(priceId: string): Promise<boolean>
}

export interface ICompanySubscription {
    execute(companyId: string): Promise<{ company: Company, isExpired: boolean }>
}