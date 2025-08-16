import { IGetActivity } from "../../../config/Dependency/user/activity.di";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";
import { Activity } from "../../../infrastructure/database/models/activity.interface";



export class GetActivities implements IGetActivity {

    constructor(private activityRepo: IActivityRepository) { }

    async execute(companyId: string, projectId: string): Promise<Activity[]> {

        const result = await this.activityRepo.getActivities(companyId, projectId);
        return result;
    }
}