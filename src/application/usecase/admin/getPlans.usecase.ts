import { IGetPlan } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";




export class GetPlansUsecase implements IGetPlan {

    constructor(private subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(limit: number, skip: number, searchTerm: string) {


        const plansWithTotalPage = await this.subscriptionRepo.getAllPlans(limit, skip, searchTerm);
        return plansWithTotalPage;
    }
}