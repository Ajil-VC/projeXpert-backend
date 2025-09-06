
import { Roles } from "../../infrastructure/database/models/role.interface";
import { Attachment } from "../../infrastructure/database/models/user.interface";

export class UserResponseDTO {

    _id!: string;
    name!: string;
    email!: string;
    profilePicUrl!: Attachment;
    role!: Roles;
    companyId!: string;
    workspaceIds: string[] = [];
    defaultWorkspace!: string;
    lastActiveProjectId?: string | null;
    forceChangePassword!: boolean;

    isBlocked!: boolean;

    systemRole!: 'platform-admin' | 'company-user';

    createdAt?: Date;
    updatedAt?: Date;

}