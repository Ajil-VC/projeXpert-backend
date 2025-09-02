import mongoose from "mongoose";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { Subscription } from "../../database/models/subscription.interface";
import subscriptionModel from "../../database/subscription.models";

export class SubscriptionPlanImp implements ISubscriptionPlanRepository {

    constructor() { }


    async changePlanStatus(planId: string): Promise<Subscription> {

        const planOb = new mongoose.Types.ObjectId(planId);
        const result = await subscriptionModel.findOneAndUpdate(
            { _id: planOb },
            [
                {
                    $set: {
                        isActive: { $not: "$isActive" }
                    }
                }
            ],
            { new: true }
        );

        if (!result) {

            throw new Error("Method not implemented.");
        }

        return result;
    }


    async deletePlan(planId: string): Promise<boolean> {

        const planOb = new mongoose.Types.ObjectId(planId);
        const result = await subscriptionModel.deleteOne({ _id: planOb });

        if (!result.acknowledged) {

            throw new Error("Couldnt delete the plan document.");
        }

        return true;
    }


    async getAllPlans(limit: number, skip: number, searchTerm: string = ''): Promise<{ plans: Subscription[], totalPage: number }> {

        const [totalCount, allSubscriptionPlans] = await Promise.all([
            subscriptionModel.countDocuments({ name: { $regex: searchTerm, $options: 'i' } }),
            subscriptionModel.find({ name: { $regex: searchTerm, $options: 'i' } })
                .skip(skip)
                .limit(limit)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        if (!allSubscriptionPlans) throw new Error('No subscription plans available');
        return { plans: allSubscriptionPlans, totalPage: totalPages };

    }

    async saveNewPlan(
        name: string,
        description: string,
        stripeProductId: string,
        stripePriceId: string,
        price: number,
        interval: "month" | "year",
        maxWorkspace: number,
        maxProjects: number,
        maxMembers: number,
        videoCall: boolean
    ): Promise<Subscription> {

        const newSubscriptionPlan = new subscriptionModel({
            name,
            description,
            stripePriceId,
            stripeProductId,
            price,
            billingCycle: interval,
            maxWorkspace,
            maxProjects,
            maxMembers,
            canUseVideoCall: videoCall
        });

        const planData = await newSubscriptionPlan.save();
        if (!planData) {
            throw new Error("Plan couldnt save into database.");
        }

        return planData;

    }

}