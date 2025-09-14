
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";




export interface ISubscriptionPlanUsecase {
    execute(
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
    ): Promise<Subscription>
}


export interface IGetPlanUsecase {
    execute(limit: number, skip: number, searchTerm: string): Promise<any>;
}

export interface IDeletePlanUsecase {
    execute(planId: string): Promise<any>;
}

export interface IChangePlanStatusUsecase {
    execute(planId: string): Promise<Subscription>;
}