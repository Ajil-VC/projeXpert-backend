import { UserDeepEntityDetailed } from "../../domain/entities/userdeep.entity";
import { UserResponseDetailedDTO } from "../../dtos/user/userDeepResponseDTO";
export class UserDeepMapper {
    static toDetailedDTO(userDoc: any): UserDeepEntityDetailed {
        return new UserDeepEntityDetailed(
            userDoc._id.toString(),
            userDoc.name,
            userDoc.profilePicUrl,
            userDoc.email,
            userDoc.role,
            userDoc.forceChangePassword,
            userDoc.workspaceIds?.map((ws: any) => ({
                _id: ws._id.toString(),
                name: ws.name,
                members: [],
                companyId: ws.companyId?.toString() ?? ws.companyId,
                projects: ws.projects?.map((proj: any) => ({
                    _id: proj._id.toString(),
                    name: proj.name,
                    workSpace: proj.workSpace?.toString() ?? proj.workSpace,
                    companyId: proj.companyId?.toString() ?? proj.companyId,
                    members: proj.members?.map((m: any) => m.toString?.() ?? m),
                    status: proj.status,
                    priority: proj.priority,
                    createdAt: proj.createdAt,
                    updatedAt: proj.updatedAt
                })),
                createdAt: ws.createdAt,
                updatedAt: ws.updatedAt
            })),
            {
                _id: userDoc.defaultWorkspace._id.toString(),
                name: userDoc.defaultWorkspace.name,
                members: [],
                companyId: userDoc.defaultWorkspace.companyId?.toString() ?? userDoc.defaultWorkspace.companyId,
                projects: userDoc.defaultWorkspace.projects?.map((proj: any) => ({
                    _id: proj._id.toString(),
                    name: proj.name,
                    workSpace: proj.workSpace?.toString() ?? proj.workSpace,
                    companyId: proj.companyId?.toString() ?? proj.companyId,
                    members: proj.members?.map((m: any) => m.toString?.() ?? m),
                    status: proj.status,
                    priority: proj.priority,
                    createdAt: proj.createdAt,
                    updatedAt: proj.updatedAt
                })),
                createdAt: userDoc.defaultWorkspace.createdAt,
                updatedAt: userDoc.defaultWorkspace.updatedAt
            }
        );
    }
}
