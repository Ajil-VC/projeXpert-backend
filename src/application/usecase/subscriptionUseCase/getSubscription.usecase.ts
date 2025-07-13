import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class GetSubscription {

    constructor(private subscribe: ISubscription) { }

    async execute(companyId: string | null): Promise<Subscription | Subscription[] | null> {

        const result = await this.subscribe.getSubscriptions(companyId);
        if (!result) throw new Error('No subscription details available.');
        return result;
    }
}