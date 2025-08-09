import { AddActivityUsecase } from "../../../application/usecase/activityUseCase/addActivity.usecase";
import { GetActivities } from "../../../application/usecase/activityUseCase/getActivities.usecase";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";
import { ActivityRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/activity.repositoryImp";




const activityRepository: IActivityRepository = new ActivityRepositoryImp();

export const addActivityUsecase = new AddActivityUsecase(activityRepository);
export const getActivities = new GetActivities(activityRepository);