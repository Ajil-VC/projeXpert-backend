import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { UserMapper } from "../../../mappers/user/user.mapper";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";
import { IUpdateProfileUsecase } from "../../../config/Dependency/user/user.di";


export class UpdateProfileUsecase implements IUpdateProfileUsecase {

    constructor(private _cloudinary: ICloudinary, private _userRepo: IUserRepository) { }

    async execute(file: Express.Multer.File, userId: string, name: string): Promise<UserResponseDTO> {

        const userData = await this._userRepo.findUserById(userId);
        const uploadedFile = file ? await this._cloudinary.uploadImage(file, 'avatar') : null;

        const result = await this._userRepo.updateUserProfile(uploadedFile, userId, name);
        if (uploadedFile && userData && userData.profilePicUrl?.public_id) {
            await this._cloudinary.deleteImage(userData.profilePicUrl.public_id);
        }
        return UserMapper.toResponseDTO(result);
    }

}