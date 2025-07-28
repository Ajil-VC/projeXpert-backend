
import { UserEntityDetailed } from "../../domain/entities/user.entity";
import { User } from "../../infrastructure/database/models/user.interface";

export class UserMapper {
    static toResponseDTO(user: User): UserEntityDetailed {
        return {

            _id: user._id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            profilePicUrl: user.profilePicUrl,
            role: user.role,
            companyId: user.companyId?.toString(),
            workspaceIds: user.workspaceIds.map(ele => ele.toString()),
            defaultWorkspace: user.defaultWorkspace.toString(),
            lastActiveProjectId: user.lastActiveProjectId ? user.lastActiveProjectId.toString() : null,
            forceChangePassword: user.forceChangePassword,

            isBlocked: user.isBlocked,
            restrict: user.restrict,

            systemRole: user.systemRole,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
