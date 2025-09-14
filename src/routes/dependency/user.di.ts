
import { AddActivityUsecase } from "../../application/usecase/activityUseCase/addActivity.usecase";
import { GetActivities } from "../../application/usecase/activityUseCase/getActivities.usecase";
import { CanMutateRoleUsecase } from "../../application/usecase/user/canmutate.usecase";
import { CreateRoleUsecase } from "../../application/usecase/user/createrole.usecase";
import { DeleteRoleUsecase } from "../../application/usecase/user/deleterole.usecase";
import { GetRoles } from "../../application/usecase/user/getRoles.usecase";
import { UpdateRoleUsecase } from "../../application/usecase/user/updaterole.usecase";
import { UpdateProfileUsecase } from "../../application/usecase/user/user.usecase";
import { IGetRoleWithIdUsecase, ICreateRoleUsecase, IDeleteRoleUsecase, IGetRolesUsecase, IUpdateRoleUsecase } from "../../config/Dependency/user/user.di";
import { ActivityController } from "../../controllers/user/activity.controller";
import { userController } from "../../controllers/user/user.controller";
import { IActivityRepository } from "../../domain/repositories/activity.repo";
import { IRoleRepository } from "../../domain/repositories/role.repo";
import { IUserRepository } from "../../domain/repositories/user.repo";
import { ICloudinary } from "../../domain/services/cloudinary.interface";
import { ActivityRepositoryImp } from "../../infrastructure/repositories/repoImplementations/activity.repositoryImp";
import { RoleRepositoryImp } from "../../infrastructure/repositories/repoImplementations/role.repositoryImp";
import { userRepositoryImp } from "../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { CloudUploadService } from "../../infrastructure/services/cloud-upload.serviceImp";
import { IActivityController } from "../../interfaces/user/activity.controller.interface";
import { IUserController } from "../../interfaces/user/user.controller.interface";


const activityRepository: IActivityRepository = new ActivityRepositoryImp();
export const addActivityUsecase = new AddActivityUsecase(activityRepository);
const getActivities = new GetActivities(activityRepository);

export const getActivitiesInterface: IActivityController = new ActivityController(getActivities);



const userRepository: IUserRepository = new userRepositoryImp();
const roleRepository: IRoleRepository = new RoleRepositoryImp();
const cloudinarySer: ICloudinary = new CloudUploadService()
export const createRoleUsecase: ICreateRoleUsecase = new CreateRoleUsecase(roleRepository);
export const getRolesUsecase: IGetRolesUsecase = new GetRoles(roleRepository);
export const updateProfile = new UpdateProfileUsecase(cloudinarySer, userRepository);
export const getRole: IGetRoleWithIdUsecase = new CanMutateRoleUsecase(roleRepository);
export const deleteRole: IDeleteRoleUsecase = new DeleteRoleUsecase(roleRepository);
export const updateRole: IUpdateRoleUsecase = new UpdateRoleUsecase(roleRepository);
export const userControllerInterface: IUserController = new userController(updateProfile, createRoleUsecase, getRolesUsecase, getRole, deleteRole, updateRole);