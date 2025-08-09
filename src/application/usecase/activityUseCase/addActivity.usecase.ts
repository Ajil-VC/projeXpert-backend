import { IActivityRepository } from "../../../domain/repositories/activity.repo";



export class AddActivityUsecase {

    constructor(private activityRepo: IActivityRepository) { }


    async execute(projectId: string, companyId: string, userId: string, action: string, target: string): Promise<void> {

        await this.activityRepo.addActivity(projectId, companyId, userId, action, target);
    }
}