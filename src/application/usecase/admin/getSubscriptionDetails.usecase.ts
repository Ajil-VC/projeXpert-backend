import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";




export class GetSubscriptions {

    constructor(private subscription: ISubscription) { }

    async execute(): Promise<Subscription[]> {

        const subs = await this.subscription.getSubscriptions(null);
        if (!Array.isArray(subs)) {
            throw new Error('Need array of Subscription in getSubscriptions');
        }
        return subs;
    }
}