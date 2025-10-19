import { IDeletePlanUsecase } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";





export class DeletePlanUseCase implements IDeletePlanUsecase {

    constructor(private _subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(planId: string): Promise<boolean> {

        const result = await this._subscriptionRepo.deletePlan(planId);
        return result;
    }
}