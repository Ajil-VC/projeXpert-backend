import { INotificationRepository } from "../../../domain/repositories/notification.repo";





export class ReadNotificationsUsecase {


    constructor(private notificationSer: INotificationRepository) { }

    async execute(userId: string, notificationId: string | null = null, removeAll: boolean = false): Promise<boolean> {

        const result = await this.notificationSer.readNotifications(userId, notificationId, removeAll);
        return result;

    }
}