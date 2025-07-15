import { Attachment } from "../../infrastructure/database/models/user.interface";


export class UserResponseDetailedDTO {

    _id!: string;
    name!: string;
    profilePicUrl!: Attachment;
    email!: string;
    role!: 'admin' | 'user';
    forceChangePassword!: boolean;

    workspaceIds!: {
        _id: string,
        name: string,
        members: [],
        companyId: string,
        projects: {
            _id: string,
            name: String,
            workSpace: string,
            companyId: string,
            members: string[],
            status: 'active' | 'archived' | 'completed',
            priority: 'low' | 'medium' | 'high' | 'critical',
            createdAt?: Date;
            updatedAt?: Date;
        }[],
        createdAt: Date,
        updatedAt: Date,
    }[];
    defaultWorkspace!: {
        _id: string,
        name: string,
        members: [],
        companyId: string,
        projects: {
            _id: string,
            name: String,
            workSpace: string,
            companyId: string,
            members: string[],
            status: 'active' | 'archived' | 'completed',
            priority: 'low' | 'medium' | 'high' | 'critical',
            createdAt?: Date;
            updatedAt?: Date;
        }[],
        createdAt: Date,
        updatedAt: Date,
    }

}