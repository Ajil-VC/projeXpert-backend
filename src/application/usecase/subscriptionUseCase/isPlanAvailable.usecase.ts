import { IIsPlanAvailableUsecase } from "../../../config/Dependency/user/subscription.di";
import { ISubscription } from "../../../domain/repositories/subscription.repo";



export class IsPlanAvailableUseCase implements IIsPlanAvailableUsecase {

    constructor(private _subscriptionRepo: ISubscription) { }

    async execute(priceId: string): Promise<boolean> {

        const plan = await this._subscriptionRepo.getPlan(priceId);
        if (!plan.isActive) {
            return false;
        }

        return true;
    }
}