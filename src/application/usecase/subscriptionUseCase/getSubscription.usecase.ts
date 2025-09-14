
import { IGetSubscriptionUsecase } from "../../../config/Dependency/user/subscription.di";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class GetSubscriptionPlans implements IGetSubscriptionUsecase {

    constructor(private _subscribe: ISubscription) { }

    async execute(limit: number, skip: number): Promise<{ plans: Subscription[], totalPage: number }> {

        const result = await this._subscribe.getAllPlans(limit, skip);
        if (!result) throw new Error('No subscription details available.');
        return result;
    }
}