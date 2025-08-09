import { Document, ObjectId } from "mongoose";


export interface companySubscription extends Document {

    _id: ObjectId;

    companyId: ObjectId;
    
    plan: ObjectId;
    currentPeriodEnd?: Date;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'other';

    createdAt?: Date;
    updatedAt?: Date;

}
