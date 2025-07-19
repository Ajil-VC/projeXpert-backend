import { NextFunction, Request, Response } from "express";

import { initDashboardUsecase } from "../../config/Dependency/user/userInit.di";
import { getNotificationsUse, readNotifications } from "../../config/Dependency/user/notification.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IUserInit } from "../../interfaces/user/userInit.controller.interface";
import { InitDashBoardUseCase } from "../../application/usecase/workspaceUsecase/initDashboard.usecase";
import { GetNotificationUsecase } from "../../application/usecase/notificationUseCase/getNotificationusecase";
import { ReadNotificationsUsecase } from "../../application/usecase/notificationUseCase/readNotification.usecase";


export class UserInitController implements IUserInit {

    private initDashboardUsecase: InitDashBoardUseCase;
    private getNotificationsUse: GetNotificationUsecase;
    private readNotifications: ReadNotificationsUsecase;
    constructor() {

        this.initDashboardUsecase = initDashboardUsecase;
        this.getNotificationsUse = getNotificationsUse;
        this.readNotifications = readNotifications;
    }

    getInitData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const userData = await this.initDashboardUsecase.execute(req.user.email, req.user.id, req.user.role);

            if (userData) {

                res.status(HttpStatusCode.OK).json({
                    status: true,
                    user: {
                        _id: userData._id,
                        name: userData.name,
                        profilePicUrl: userData.profilePicUrl,
                        email: userData.email,
                        role: userData.role,
                        workSpaces: userData.workspaceIds,
                        defaultWorkspace: userData.defaultWorkspace,
                        forceChangePassword: userData.forceChangePassword
                    }
                });

            }

        } catch (err) {
            next(err)
        }

    }

    getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const notifications = await this.getNotificationsUse.execute(req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, result: notifications });
            return;

        } catch (err) {
            next(err);
        }
    }


    updateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { notificaionId, removeAll } = req.body;
            const result = await this.readNotifications.execute(req.user.id, notificaionId, removeAll);
            res.status(HttpStatusCode.OK).json({ status: true });
            return;

        } catch (err) {

            next(err);
        }
    }

}

