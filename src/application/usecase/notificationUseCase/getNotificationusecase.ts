import { IGetNotificationUsecase } from "../../../config/Dependency/user/notification.di";
import { INotificationRepository } from "../../../domain/repositories/notification.repo";
import { Notification } from "../../../infrastructure/database/models/notification.interface";


export class GetNotificationUsecase implements IGetNotificationUsecase {

    constructor(private _notificationRepo: INotificationRepository) { }

    async execute(userId: string): Promise<Array<Notification>> {

        const notifications = await this._notificationRepo.getNotifications(userId);
        return notifications;
    }
}