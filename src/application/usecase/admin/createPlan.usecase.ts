import { ISubscriptionPlan } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";



export class CreatePlanUseCase implements ISubscriptionPlan {

    constructor(private subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(
        name: string,
        description: string,
        stripeProductId: string,
        stripePriceId: string,
        price: number,
        interval: 'month' | 'year',
        maxWorkspace: number,
        maxProjects: number,
        maxMembers: number,
        videoCall: boolean
    ): Promise<Subscription> {

        const newPlan = await this.subscriptionRepo.saveNewPlan(
            name,
            description,
            stripeProductId,
            stripePriceId,
            price,
            interval,
            maxWorkspace,
            maxProjects,
            maxMembers,
            videoCall
        );
        return newPlan;
    }

}