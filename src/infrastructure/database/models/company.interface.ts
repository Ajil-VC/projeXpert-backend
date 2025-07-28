import { Document, ObjectId } from "mongoose";


export interface Company extends Document {

    _id: ObjectId;
    name: String;
    email: String;

    subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'other';
    plan: ObjectId;
    currentPeriodEnd?: Date;
    stripeCustomerId: string;
    stripeSubscriptionId: string;

    workspaces: ObjectId[];
    isBlocked: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}