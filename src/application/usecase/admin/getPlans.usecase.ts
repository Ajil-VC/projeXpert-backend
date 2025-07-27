import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";




export class GetPlansUsecase {

    constructor(private subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(limit: number, skip: number) {

        const plansWithTotalPage = await this.subscriptionRepo.getAllPlans(limit, skip);
        return plansWithTotalPage;
    }
}