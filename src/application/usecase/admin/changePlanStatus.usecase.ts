import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class ChangePlanStatusUsecase {

    constructor(private subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(planId: string): Promise<Subscription> {

        const result = await this.subscriptionRepo.changePlanStatus(planId);
        return result;
    };
}