import mongoose from "mongoose";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../database/models/subscription.interface";
import subscriptionModel from "../../database/subscription.models";
import companyModel from "../../database/company.models";
import { BaseRepository } from "../base.repository";





export class SubscriptionImp extends BaseRepository<Subscription> implements ISubscription {

    constructor() {
        super(subscriptionModel);
    }


    async getSubscriptions(companyId: string | null): Promise<Subscription | Subscription[] | null> {

        if (!companyId) {
            
            const subscriptions = await subscriptionModel.find().populate('companyId');
            if (!subscriptions) {
                throw new Error('Subscriptions couldnt retrieve.');
            }
            return subscriptions;

        }

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        const subscription = await subscriptionModel.findOne({ companyId: companyIdOb });
        if (!subscription) {
            return null;
        }
        return subscription;

    }


    async createSubscription(
        companyId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        plan: "Pro" | "Enterprise",
        status: string,
        billingCycle: "month" | "year",
        currentPeriodEnd: Date): Promise<Subscription> {

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        let subStatus = 'other';
        if (status === 'active' || status === 'canceled' || status === 'past_due') {
            subStatus = status;
        }

        const updatedSubscription = await subscriptionModel.findOneAndUpdate(
            { companyId: companyIdOb },
            {
                $set: {
                    stripeCustomerId,
                    stripeSubscriptionId,
                    plan,
                    status: subStatus,
                    billingCycle,
                    currentPeriodEnd,
                },
            },
            { new: true, upsert: true }
        );

        if (!updatedSubscription) {
            throw new Error('Subscription not saved.');
        }

        return updatedSubscription;
    }
}