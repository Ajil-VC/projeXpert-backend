
import { Company } from "../../../infrastructure/database/models/company.interface";
import { DecodedData } from "../../../application/shared/decodedData";
import { Project } from "../../../infrastructure/database/models/project.interface";


export interface IGetWorkspaceUsecase {
    execute(user: DecodedData): Promise<Company | null>
}

export interface ICreateProjectUsecase {
    execute(projectName: string, workSpace: string, priority: string, user: DecodedData): Promise<Project | null>
}

export interface IGetProjectsinWorkspaceUsecase {
    execute(workSpaceId: string, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }>;
}

export interface IGetCurrentProjectUsecase {
    execute(workSpaceId: string, projectId: string): Promise<Project | null>;
}

export interface IAddMemberUsecase {
    execute(email: string, projectId: string, workSpaceId: string, companyId: string, roleId: string): Promise<Project | null>;
}

export interface IRemoveMemberUsecase {
    execute(projectId: string, userId: string, currUserId: string): Promise<boolean>
}

export interface IUpdateProjectUsecase {
    execute(

        projectId: string,
        projectName: string,
        status: string,
        priority: string,
        members: Array<{ email: string, role: string }>,
        adminEmail: string): Promise<any>
}

export interface IDeleteProjectUsecase {
    execute(projectId: string, workSpaceId: string): Promise<boolean>;
}

export interface IProjectStatusUsecase {
    execute(projectId: string, userId: string, userRole: 'admin' | 'user', companyId: string): Promise<any>;
}

export interface IRetrieveProjectUsecase {
    execute(projectId: string): Promise<Project>;
}