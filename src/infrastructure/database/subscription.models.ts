import mongoose, { model, Schema } from "mongoose";
import { Subscription } from "./models/subscription.interface";

const subscriptionSchema = new Schema<Subscription>({

    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    billingCycle: { type: String, enum: ['month', 'year'], required: true },

    maxWorkspace: { type: Number, required: true },
    maxProjects: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
    canUseVideoCall: { type: Boolean, required: true },

    isActive: { type: Boolean, required: true, default: false }

}, { timestamps: true })

const subscriptionModel = mongoose.models.Subscription || model<Subscription>('Subscription', subscriptionSchema);
export default subscriptionModel;