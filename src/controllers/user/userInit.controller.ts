import { NextFunction, Request, Response } from "express";

import { IInitDashboardUsecase } from "../../config/Dependency/user/userInit.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IUserInitController } from "../../interfaces/user/userInit.controller.interface";
import { IGetNotificationUsecase, IReadNotificationUsecase } from "../../config/Dependency/user/notification.di";


export class UserInitController implements IUserInitController {

    constructor(
        private _initDashboardUsecase: IInitDashboardUsecase,
        private _getNotificationsUse: IGetNotificationUsecase,
        private _readNotifications: IReadNotificationUsecase
    ) { }

    getInitData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const userData = await this._initDashboardUsecase.execute(req.user.email, req.user.id, req.user.role);

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

            const notifications = await this._getNotificationsUse.execute(req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, result: notifications });
            return;

        } catch (err) {
            next(err);
        }
    }


    updateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { notificaionId, removeAll } = req.body;
            await this._readNotifications.execute(req.user.id, notificaionId, removeAll);
            res.status(HttpStatusCode.OK).json({ status: true });
            return;

        } catch (err) {

            next(err);
        }
    }

}

