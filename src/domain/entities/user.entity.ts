
import { Roles } from "../../infrastructure/database/models/role.interface";
import { Attachment } from "../../infrastructure/database/models/user.interface";

export class UserEntityDetailed {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly profilePicUrl: Attachment,
        public readonly role: Roles,
        public readonly companyId: string,
        public readonly workspaceIds: string[],
        public readonly defaultWorkspace: string,
        public readonly systemRole: 'platform-admin' | 'company-user',
        public readonly forceChangePassword: boolean,
        public readonly isBlocked: boolean,
        public readonly lastActiveProjectId?: string | null,

        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}