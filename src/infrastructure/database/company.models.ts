import { model, Schema } from "mongoose";
import { Company } from "../../domain/entities/company.interface";

const companySchema = new Schema<Company>({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    isBlocked: { type: Boolean, default: false }

}, { timestamps: true })

const companyModel = model<Company>('Company', companySchema);
export default companyModel;