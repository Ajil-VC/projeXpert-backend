import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class SubscriptionUsecase {

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

        const subscription = await this.subcribe.createSubscription(
            company._id as unknown as string,
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus,
            currentPeriodEnd,
            productId);

        if (!subscription) {
            throw new Error('Couldnt create the subscription.');
        }

        return subscription;
    }
}