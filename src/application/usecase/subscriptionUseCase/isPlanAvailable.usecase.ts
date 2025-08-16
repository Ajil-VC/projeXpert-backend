import { IIsPlanAvailable } from "../../../config/Dependency/user/subscription.di";
import { ISubscription } from "../../../domain/repositories/subscription.repo";



export class IsPlanAvailableUseCase implements IIsPlanAvailable {

    constructor(private subscriptionRepo: ISubscription) { }

    async execute(priceId: string): Promise<boolean> {

        const plan = await this.subscriptionRepo.getPlan(priceId);
        if (!plan.isActive) {
            return false;
        }

        return true;
    }
}