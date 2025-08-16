
import { Notification } from "../../../infrastructure/database/models/notification.interface";


export interface ICreateNotification {
    execute(senderId: string, recieverId: string, type: "task" | "message", message: string, link: string): Promise<Notification>;
}

export interface IGetNotification {
    execute(userId: string): Promise<Array<Notification>>;
}

export interface IReadNotification {
    execute(userId: string, notificationId: string | null, removeAll: boolean): Promise<boolean>;
}