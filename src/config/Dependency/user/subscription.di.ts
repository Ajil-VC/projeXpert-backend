
import { Company } from "../../../infrastructure/database/models/company.interface";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";

export interface ISubscribeUsecase {
    execute(
        ownerEmail: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription>
}

export interface IGetSubscriptionUsecase {
    execute(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }>
}

export interface IIsPlanAvailableUsecase {
    execute(priceId: string): Promise<boolean>
}

export interface ICompanySubscriptionUsecase {
    execute(companyId: string): Promise<{ company: Company, isExpired: boolean }>
}