import { IGetActivityUsecase } from "../../../config/Dependency/user/activity.di";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";
import { Activity } from "../../../infrastructure/database/models/activity.interface";



export class GetActivities implements IGetActivityUsecase {

    constructor(private _activityRepo: IActivityRepository) { }

    async execute(companyId: string, projectId: string): Promise<Activity[]> {
        
        const result = await this._activityRepo.getActivities(companyId, projectId);
        return result;
    }
}