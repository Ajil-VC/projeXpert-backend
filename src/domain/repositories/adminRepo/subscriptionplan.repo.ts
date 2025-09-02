
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";



export interface ISubscriptionPlanRepository {


    changePlanStatus(planId: string): Promise<Subscription>;

    saveNewPlan(
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
    ): Promise<Subscription>;

    deletePlan(planId: string): Promise<boolean>;

    getAllPlans(limit: number, skip: number, searchTerm: string): Promise<{ plans: Subscription[], totalPage: number }>;
}