import mongoose from "mongoose";
import { INotificationRepository } from "../../domain/repositories/notification.repo"
import { Notification } from "../database/models/notification.interface";
import notificationModel from "../database/notification.models";





export class NotificationRepoImp implements INotificationRepository {


    async readNotifications(userId: string, notificationId: string | null, removeAll: boolean): Promise<boolean> {

        const userIdOb = new mongoose.Types.ObjectId(userId);

        if (removeAll) {

            const result = await notificationModel.deleteMany({ recieverId: userIdOb });
            if (result.acknowledged) return true;
            return false;
        }
        if (notificationId == null) {
            const result = await notificationModel.updateMany({ recieverId: userIdOb, read: false },
                { $set: { read: true } }
            )

            if (result.modifiedCount > 0) return true;
            return false;
        }

        const notificationIdOb = new mongoose.Types.ObjectId(notificationId);
        const result = await notificationModel.updateOne({ _id: notificationIdOb }, { $set: { read: true } });
        if (result.modifiedCount > 0) return true;
        return false;
    }


    async getNotifications(userId: string): Promise<Array<Notification>> {

        const userIdOb = new mongoose.Types.ObjectId(userId);

        const notifications = await notificationModel.find({ recieverId: userIdOb })
            .sort({ createdAt: -1 }).limit(15);
        return notifications;
    }


    async createNotification(senderId: string, recieverId: string, type: "task" | "message", message: string, link: string): Promise<Notification> {

        const senderIdOb = new mongoose.Types.ObjectId(senderId);
        const recieverIdOb = new mongoose.Types.ObjectId(recieverId);

        const newNotification = new notificationModel({
            senderId: senderIdOb,
            recieverId: recieverIdOb,
            type: type,
            message: message,
            link: link,
        });
        const notification = await newNotification.save();

        if (!notification) throw new Error('Notification couldnt create.');
        return notification;
    }


}