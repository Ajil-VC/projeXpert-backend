import { IAddActivityUsecase } from "../../../config/Dependency/user/activity.di";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";



export class AddActivityUsecase implements IAddActivityUsecase {

    constructor(private _activityRepo: IActivityRepository) { }


    async execute(projectId: string, companyId: string, userId: string, action: string, target: string | null): Promise<void> {

        await this._activityRepo.addActivity(projectId, companyId, userId, action, target);
    }
}