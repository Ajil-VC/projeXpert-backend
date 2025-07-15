import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { UserMapper } from "../../../mappers/user/user.mapper";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export class UpdateProfileUsecase {

    constructor(private cloudinary: ICloudinary, private userRepo: IUserRepository) { }

    async execute(file: Express.Multer.File, userId: string, name: string): Promise<UserResponseDTO> {

        const userData = await this.userRepo.findUserById(userId);
        const uploadedFile = file ? await this.cloudinary.uploadImage(file, 'avatar') : null;

        const result = await this.userRepo.updateUserProfile(uploadedFile, userId, name);
        if (uploadedFile && userData && userData.profilePicUrl?.public_id) {
            await this.cloudinary.deleteImage(userData.profilePicUrl.public_id);
        }
        return UserMapper.toResponseDTO(result);
    }

}