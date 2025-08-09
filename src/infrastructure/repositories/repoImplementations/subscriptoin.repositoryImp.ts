import mongoose from "mongoose";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { Subscription } from "../../database/models/subscription.interface";
import subscriptionModel from "../../database/subscription.models";
import companyModel from "../../database/company.models";
import { BaseRepository } from "../base.repository";
import { companySubscription } from "../../database/models/companySubscription.interface";
import companySubscriptionModel from "../../database/companySubscription.model";





export class SubscriptionImp extends BaseRepository<Subscription> implements ISubscription {

    constructor() {
        super(subscriptionModel);
    }

    async createSubscriptionForCompany(
        companyId: string,
        plan: string,
        currentPeriodEnd: Date,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string): Promise<companySubscription> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const planId = new mongoose.Types.ObjectId(plan);

        const newCompanySubscription = new companySubscriptionModel({
            companyId: companyOb,
            plan: planId,
            currentPeriodEnd,
            stripeCustomerId,
            stripeSubscriptionId,
            subscriptionStatus
        });

        const createdCompanySubscription = await newCompanySubscription.save();
        if (!createdCompanySubscription) {
            throw new Error("Method not implemented.");
        }

        return createdCompanySubscription;

    }

    async getPlan(priceId: string): Promise<Subscription> {

        const plan = await subscriptionModel.findOne({ stripePriceId: priceId });
        if (!plan) {
            throw new Error("Plan is not available.");
        }

        return plan;
    }

    async getAllPlans(limit: number, skip: number): Promise<{ plans: Subscription[]; totalPage: number; }> {

        const totalCount = await subscriptionModel.countDocuments({});

        const allSubscriptionPlans = await subscriptionModel.find({ isActive: true })
            .skip(skip)
            .limit(limit)

        const totalPages = Math.ceil(totalCount / limit);

        if (!allSubscriptionPlans) throw new Error('No subscription plans available');
        return { plans: allSubscriptionPlans, totalPage: totalPages };

    }


    async addSubscriptionToCompany(
        companyId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        status: string,
        currentPeriodEnd: Date,
        productId: string
    ): Promise<Subscription> {

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        let subStatus = 'other';
        if (status === 'active' || status === 'canceled' || status === 'past_due') {
            subStatus = status;
        }

        const subscribedPlan = await subscriptionModel.findOne({ stripeProductId: productId });

        const updatedCompany = await companyModel.findOneAndUpdate(
            { _id: companyIdOb },
            {
                $set: {
                    plan: subscribedPlan._id,
                    currentPeriodEnd,
                    stripeCustomerId,
                    stripeSubscriptionId,
                    subscriptionStatus: subStatus
                }
            },
            { new: true }
        );

        if (!updatedCompany) {
            throw new Error('Subscription not saved.');
        }

        return subscribedPlan;
    }
}