import mongoose, { Schema } from "mongoose";
import { Notification } from "./models/notification.interface";
import { model } from "mongoose";





const notificationSchema = new Schema<Notification>({

    senderId: { type: Schema.Types.ObjectId },
    recieverId: { type: Schema.Types.ObjectId },
    type: { type: String, enum: ["task", "message"] },
    message: { type: String },
    link: { type: String },

    read: { type: Boolean, default: false },

}, { timestamps: true });

const notificationModel = mongoose.models.Notification || model<Notification>('Notification', notificationSchema);
export default notificationModel;