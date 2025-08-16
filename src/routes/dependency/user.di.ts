
import { AddActivityUsecase } from "../../application/usecase/activityUseCase/addActivity.usecase";
import { GetActivities } from "../../application/usecase/activityUseCase/getActivities.usecase";
import { UpdateProfileUsecase } from "../../application/usecase/user/user.usecase";
import { ActivityController } from "../../controllers/user/activity.controller";
import { userController } from "../../controllers/user/user.controller";
import { IActivityRepository } from "../../domain/repositories/activity.repo";
import { IUserRepository } from "../../domain/repositories/user.repo";
import { ICloudinary } from "../../domain/services/cloudinary.interface";
import { ActivityRepositoryImp } from "../../infrastructure/repositories/repoImplementations/activity.repositoryImp";
import { userRepositoryImp } from "../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { CloudUploadService } from "../../infrastructure/services/cloud-upload.serviceImp";
import { IActivityController } from "../../interfaces/user/activity.controller.interface";
import { IUserController } from "../../interfaces/user/user.controller.interface";


const activityRepository: IActivityRepository = new ActivityRepositoryImp();
export const addActivityUsecase = new AddActivityUsecase(activityRepository);
const getActivities = new GetActivities(activityRepository);

export const getActivitiesInterface: IActivityController = new ActivityController(getActivities);




const userRepository: IUserRepository = new userRepositoryImp();
const cloudinarySer: ICloudinary = new CloudUploadService()
export const updateProfile = new UpdateProfileUsecase(cloudinarySer, userRepository);
export const userControllerInterface: IUserController = new userController(updateProfile);