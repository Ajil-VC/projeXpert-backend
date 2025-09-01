import mongoose, { model, Schema } from "mongoose";
import { Activity } from "./models/activity.interface";


const ActivitySchema = new Schema<Activity>({

    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    target: { type: String }

}, { timestamps: true });

const activityModel = mongoose.models.Activity || model<Activity>('Activity', ActivitySchema);
export default activityModel;