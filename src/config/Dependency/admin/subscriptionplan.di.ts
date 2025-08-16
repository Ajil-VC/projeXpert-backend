
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";




export interface ISubscriptionPlan {
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


export interface IGetPlan {
    execute(limit: number, skip: number): Promise<any>;
}

export interface IDeletePlan {
    execute(planId: string): Promise<any>;
}

export interface IChangePlanStatus {
    execute(planId: string): Promise<Subscription>;
}