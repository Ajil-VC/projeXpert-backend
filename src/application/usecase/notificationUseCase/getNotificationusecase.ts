import { INotificationRepository } from "../../../domain/repositories/notification.repo";
import { Notification } from "../../../infrastructure/database/models/notification.interface";


export class GetNotificationUsecase {

    constructor(private notificationRepo: INotificationRepository) { }

    async execute(userId: string): Promise<Array<Notification>> {

        const notifications = await this.notificationRepo.getNotifications(userId);
        return notifications;
    }
}