import { Notification } from "../../infrastructure/database/models/notification.interface";




export interface INotificationRepository {

    createNotification(senderId: string, recieverId: string, type: "task" | "message", message: string, link: string): Promise<Notification>;

    getNotifications(userId: string): Promise<Array<Notification>>;

    readNotifications(userId: string, notificationId: string | null, removeAll: boolean): Promise<boolean>;

}