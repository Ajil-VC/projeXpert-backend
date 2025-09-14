
import { Notification } from "../../../infrastructure/database/models/notification.interface";


export interface ICreateNotificationUsecase {
    execute(senderId: string, recieverId: string, type: "task" | "message", message: string, link: string): Promise<Notification>;
}

export interface IGetNotificationUsecase {
    execute(userId: string): Promise<Array<Notification>>;
}

export interface IReadNotificationUsecase {
    execute(userId: string, notificationId: string | null, removeAll: boolean): Promise<boolean>;
}