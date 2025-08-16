import { GetNotificationUsecase } from "../../../application/usecase/notificationUseCase/getNotificationusecase";
import { CreateNotification } from "../../../application/usecase/notificationUseCase/notification.usecase";
import { ReadNotificationsUsecase } from "../../../application/usecase/notificationUseCase/readNotification.usecase";
import { ICreateNotification } from "../../../config/Dependency/user/notification.di";
import { INotificationRepository } from "../../../domain/repositories/notification.repo";
import { NotificationRepoImp } from "../../../infrastructure/repositories/repoImplementations/notification.repositoyImp";

const notificationRepo: INotificationRepository = new NotificationRepoImp();

export const getNotificationsUse = new GetNotificationUsecase(notificationRepo);
export const readNotifications = new ReadNotificationsUsecase(notificationRepo);
export const notification: ICreateNotification = new CreateNotification(notificationRepo);
