
import { Company } from "../../../infrastructure/database/models/company.interface";
import { DecodedData } from "../../../application/shared/decodedData";
import { Project } from "../../../infrastructure/database/models/project.interface";


export interface IGetWorkspace {
    execute(user: DecodedData): Promise<Company | null>
}

export interface ICreateProject {
    execute(projectName: String, workSpace: String, priority: String, user: DecodedData): Promise<Project | null>
}

export interface IGetProjectsinWorkspace {
    execute(workSpaceId: String, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }>;
}

export interface IGetCurrentProject {
    execute(workSpaceId: string, projectId: string): Promise<any>;
}

export interface IAddMember {
    execute(email: string, projectId: string, workSpaceId: string, companyId: string, roleId: string): Promise<Project | null>;
}

export interface IRemoveMember {
    execute(projectId: string, userId: string, currUserId: string): Promise<boolean>
}

export interface IUpdateProject {
    execute(

        projectId: string,
        projectName: string,
        status: string,
        priority: string,
        members: Array<{ email: string, role: string }>,
        adminEmail: string): Promise<any>
}

export interface IDeleteProject {
    execute(projectId: string, workSpaceId: string): Promise<boolean>;
}

export interface IProjectStatus {
    execute(projectId: string, userId: string, userRole: 'admin' | 'user', companyId: string): Promise<any>;
}

export interface IRetrieveProject {
    execute(projectId: string): Promise<Project>;
}