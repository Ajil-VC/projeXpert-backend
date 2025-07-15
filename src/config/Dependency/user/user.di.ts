import { UpdateProfileUsecase } from "../../../application/usecase/user/user.usecase";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { CloudUploadService } from "../../../infrastructure/services/cloud-upload.serviceImp";



const userRepository: IUserRepository = new userRepositoryImp();
const cloudinarySer: ICloudinary = new CloudUploadService()

export const updateProfile = new UpdateProfileUsecase(cloudinarySer, userRepository);