import { Document, ObjectId } from "mongoose";


export interface Company extends Document {

    _id: ObjectId;
    name: string;
    email: string;

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