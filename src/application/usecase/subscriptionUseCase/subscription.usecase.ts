import { ISubscribe } from "../../../config/Dependency/user/subscription.di";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class SubscriptionUsecase implements ISubscribe {

    constructor(private company: ICompanyRepository, private subcribe: ISubscription) { }

    async execute(
        ownerEmail: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription> {

        const company = await this.company.findCompanyByEmail(ownerEmail);

        if (!company) {
            throw new Error('Couldnt find the company details');
        }

        const subscription = await this.subcribe.addSubscriptionToCompany(
            company._id as unknown as string,
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus,
            currentPeriodEnd,
            productId);

        const companySubscription = await this.subcribe.createSubscriptionForCompany(
            company._id as unknown as string,
            subscription._id as unknown as string,
            currentPeriodEnd,
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus
        );

        if (!subscription) {
            throw new Error('Couldnt create the subscription.');
        } else if (!companySubscription) {
            throw new Error('Couldnt save the subscribed plan.');
        }

        return subscription;
    }
}