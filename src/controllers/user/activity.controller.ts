import { Request, Response, NextFunction } from "express";
import { GetActivities } from "../../application/usecase/activityUseCase/getActivities.usecase";
import { getActivities } from "../../config/Dependency/user/activity.di";
import { Activity } from "../../infrastructure/database/models/activity.interface";
import { IActivityController } from "../../interfaces/user/activity.controller.interface";
import { HttpStatusCode } from "../../config/http-status.enum";






export class ActivityController implements IActivityController {

    private getActivities: GetActivities;
    constructor() {
        this.getActivities = getActivities
    }

    getActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const projectId = req.query.projectId;
            if (typeof projectId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: "Couldnt retrieve activities." });
                return;
            }

            const activities = await this.getActivities.execute(req.user.companyId, projectId);
            res.status(HttpStatusCode.OK).json({ status: true, activities });
            return;

        } catch (err) {
            next(err);
        }
    }
}