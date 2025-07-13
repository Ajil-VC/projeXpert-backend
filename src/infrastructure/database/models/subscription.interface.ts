import { Document, ObjectId } from "mongoose";


export interface Subscription extends Document {

    _id: ObjectId;
    companyId: ObjectId;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    plan: 'Pro' | 'Enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'other';
    billingCycle: 'month' | 'year';
    currentPeriodEnd: Date;

    createdAt?: Date;
    updatedAt?: Date;

}