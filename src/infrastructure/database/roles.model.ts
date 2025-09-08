import mongoose, { model, Schema } from "mongoose";
import { PERMISSIONS, Roles } from "./models/role.interface";


const RolesSchema = new Schema<Roles>({

    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    permissions: { type: [String], enum: PERMISSIONS, required: true },
    canMutate: { type: Boolean, required: true, default: true },
    companyId: { type: Schema.Types.ObjectId, required: true, ref: 'Company' }

}, { timestamps: true });

RolesSchema.index({ companyId: 1, name: 1 }, { unique: true });

const RolesModel = mongoose.models.Roles || model<Roles>('Roles', RolesSchema);
export default RolesModel;