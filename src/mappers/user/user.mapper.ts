
import { UserEntityDetailed } from "../../domain/entities/user.entity";
import { UserResponseDetailedDTO } from "../../dtos/user/userResponseDTO";

export class UserMapper {
    static toResponseDTO(user: UserEntityDetailed): UserResponseDetailedDTO {
        return {

            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            role: user.role,
            companyId: user.companyId,
            workspaceIds: user.workspaceIds,
            defaultWorkspace: user.defaultWorkspace,
            lastActiveProjectId: user.lastActiveProjectId,
            forceChangePassword: user.forceChangePassword,

            isBlocked: user.isBlocked,

            systemRole: user.systemRole,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
