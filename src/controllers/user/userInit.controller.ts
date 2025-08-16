import { NextFunction, Request, Response } from "express";

import { IInitDashboard } from "../../config/Dependency/user/userInit.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IUserInit } from "../../interfaces/user/userInit.controller.interface";
import { IGetNotification, IReadNotification } from "../../config/Dependency/user/notification.di";


export class UserInitController implements IUserInit {

    constructor(
        private initDashboardUsecase: IInitDashboard,
        private getNotificationsUse: IGetNotification,
        private readNotifications: IReadNotification
    ) { }

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

