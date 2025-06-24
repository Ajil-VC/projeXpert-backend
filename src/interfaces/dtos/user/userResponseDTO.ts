


export class UserResponseDetailedDTO {

    _id!: string;
    name!: string;
    email!: string;
    profilePicUrl!: string;
    role!: 'admin' | 'user';
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