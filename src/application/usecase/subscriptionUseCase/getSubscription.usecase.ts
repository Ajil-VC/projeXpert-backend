
import { IGetSubscription } from "../../../config/Dependency/user/subscription.di";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class GetSubscriptionPlans implements IGetSubscription {

    constructor(private subscribe: ISubscription) { }

    async execute(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }> {

        const result = await this.subscribe.getAllPlans(limit, skip);
        if (!result) throw new Error('No subscription details available.');
        return result;
    }
}