import { INotificationRepository } from "../../../domain/repositories/notification.repo";
import { Notification } from "../../../infrastructure/database/models/notification.interface";



export class CreateNotification {

    constructor(private notificationRepo: INotificationRepository) { }

    async execute(senderId: string, recieverId: string, type: "task" | "message", message: string, link: string): Promise<Notification> {

        const result = await this.notificationRepo.createNotification(senderId, recieverId, type, message, link);
        return result;

    }
}