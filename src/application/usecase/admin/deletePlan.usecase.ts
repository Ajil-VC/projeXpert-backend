import { IDeletePlan } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";





export class DeletePlanUseCase implements IDeletePlan {

    constructor(private subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(planId: string) {

        const result = await this.subscriptionRepo.deletePlan(planId);
        return result;
    }
}