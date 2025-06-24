import { NextFunction, Request, Response } from "express";

import { initDashboardUsecase } from "../../../config/Dependency/user/userInit.di";
import { getNotificationsUse, readNotifications } from "../../../config/Dependency/user/notification.di";

export const getInitData = async (req: Request, res: Response) => {

    try {

        const userData = await initDashboardUsecase.execute(req.user.email, req.user.id, req.user.role);

        if (userData) {

            res.status(200).json({
                status: true,
                user: {
                    _id: userData._id,
                    name: userData.name,
                    profileUrl: userData.profilePicUrl,
                    email: userData.email,
                    role: userData.role,
                    workSpaces: userData.workspaceIds,
                    defaultWorkspace: userData.defaultWorkspace,
                    forceChangePassword: userData.forceChangePassword
                }
            });

        }

    } catch (err) {
        console.error(`Error occured while trying to get init data. ${err}`);
    }

}

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const notifications = await getNotificationsUse.execute(req.user.id);
        res.status(200).json({ status: true, result: notifications });
        return;

    } catch (err) {
        next(err);
    }
}

export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { notificaionId, removeAll } = req.body;
        const result = await readNotifications.execute(req.user.id, notificaionId, removeAll);
        res.status(200).json({ status: true });
        return;

    } catch (err) {

        next(err);
    }
}