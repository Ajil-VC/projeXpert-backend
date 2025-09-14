import { Request, Response, NextFunction } from "express";

import { IGetActivityUsecase } from "../../config/Dependency/user/activity.di";
import { IActivityController } from "../../interfaces/user/activity.controller.interface";
import { HttpStatusCode } from "../../config/http-status.enum";






export class ActivityController implements IActivityController {

    constructor(private _getActivities: IGetActivityUsecase) { }

    getActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.projectId === 'null' ? null : req.query.projectId;
            if (typeof projectId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: "Activities not available." });
                return;
            }

            const activities = await this._getActivities.execute(req.user.companyId, projectId);
            res.status(HttpStatusCode.OK).json({ status: true, activities });
            return;

        } catch (err) {
            next(err);
        }
    }
}