import { IAddActivity } from "../../../config/Dependency/user/activity.di";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";



export class AddActivityUsecase implements IAddActivity {

    constructor(private activityRepo: IActivityRepository) { }


    async execute(projectId: string, companyId: string, userId: string, action: string, target: string): Promise<void> {

        await this.activityRepo.addActivity(projectId, companyId, userId, action, target);
    }
}