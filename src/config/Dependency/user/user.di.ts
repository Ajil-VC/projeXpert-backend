
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";

export interface IUpdateProfile {
    execute(file: Express.Multer.File, userId: string, name: string): Promise<UserResponseDTO>;
}