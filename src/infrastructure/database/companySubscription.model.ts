


import mongoose, { model, Schema } from "mongoose";
import { companySubscription } from "./models/companySubscription.interface";


const companySubscriptionSchema = new Schema<companySubscription>({

    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    currentPeriodEnd: { type: Date, required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    subscriptionStatus: { type: String, enum: ['active', 'canceled', 'past_due', 'other'] }

}, { timestamps: true });

const companySubscriptionModel = mongoose.models.companySubscription || model<companySubscription>('CompanySubscription', companySubscriptionSchema);
export default companySubscriptionModel;