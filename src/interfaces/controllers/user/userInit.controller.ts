import { Request, Response } from "express";

import { initDashboardUsecase } from "../../../config/Dependency/user/userInit.di";


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