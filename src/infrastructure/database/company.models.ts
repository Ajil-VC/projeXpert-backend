import { Schema } from "mongoose";
import { Company } from "../../domain/entities/company.interface";

const companySchema = new Schema<Company>({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
    defaultWorkspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }]

}, { timestamps: true })