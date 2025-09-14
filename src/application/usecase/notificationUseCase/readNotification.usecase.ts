import { IReadNotificationUsecase } from "../../../config/Dependency/user/notification.di";
import { INotificationRepository } from "../../../domain/repositories/notification.repo";





export class ReadNotificationsUsecase implements IReadNotificationUsecase {


    constructor(private _notificationSer: INotificationRepository) { }

    async execute(userId: string, notificationId: string | null = null, removeAll: boolean = false): Promise<boolean> {

        const result = await this._notificationSer.readNotifications(userId, notificationId, removeAll);
        return result;

    }
}