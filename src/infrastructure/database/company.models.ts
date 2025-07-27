import mongoose, { model, Schema } from "mongoose";
import { Company } from "./models/company.interface";

const companySchema = new Schema<Company>({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Subscription' },

    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },

    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    isBlocked: { type: Boolean, default: false }

}, { timestamps: true })

const companyModel = mongoose.models.Company || model<Company>('Company', companySchema);
export default companyModel;