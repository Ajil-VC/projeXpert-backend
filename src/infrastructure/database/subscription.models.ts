import mongoose, { model, Schema } from "mongoose";
import { Subscription } from "./models/subscription.interface";

const subscriptionSchema = new Schema<Subscription>({

    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    plan: { type: String, enum: ['Pro', 'Enterprise'], required: true },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], default: 'active' },
    billingCycle: { type: String, enum: ['month', 'year'], required: true },
    currentPeriodEnd: { type: Date, required: true }

}, { timestamps: true })

const subscriptionModel = mongoose.models.Subscription || model<Subscription>('Subscription', subscriptionSchema);
export default subscriptionModel;