import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class SubscriptionUsecase {

    constructor(private company: ICompanyRepository, private subcribe: ISubscription) { }

    async execute(
        ownerEmail: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        plan: string,
        subscriptionStatus: string,
        billingCycle: string,
        currentPeriodEnd: Date
    ): Promise<Subscription> {

        const company = await this.company.findCompanyByEmail(ownerEmail);
        if (!company) {
            throw new Error('Couldnt find the company details');
        }

        if (plan !== 'Pro' && plan !== 'Enterprise') {
            throw new Error('Plan should be Pro or Enterprise.');
        }
        
        if (billingCycle !== 'month' && billingCycle !== 'year') {
            throw new Error('billing cycle should be either monthly or yearly.');
        }

        const subscription = await this.subcribe.createSubscription(company._id as unknown as string, stripeCustomerId, stripeSubscriptionId, plan, subscriptionStatus, billingCycle, currentPeriodEnd);
        if (!subscription) {
            throw new Error('Couldnt create the subscription.');
        }

        company.plan = plan;
        const updatedCompany = await this.company.updateCompanyDetails(company);
        if (!updatedCompany) {
            throw new Error('Company plan couldnt update.');
        }

        return subscription;
    }
}