import { IChangePlanStatusUsecase } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";


export class ChangePlanStatusUsecase implements IChangePlanStatusUsecase {

    constructor(private _subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(planId: string): Promise<Subscription> {

        const result = await this._subscriptionRepo.changePlanStatus(planId);
        return result;
    };
}