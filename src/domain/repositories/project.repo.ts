
import { Project } from "../../infrastructure/database/models/project.interface";


export interface IProjectRepository {

    createProject(
        projectName: String,
        workSpace: String,
        priority: String,
        companyId: String,
        memberId: String
    ): Promise<Project>;

    getProjects(workSpaceId: String): Promise<Array<any>>;

    getCurProject(workspaceId : string, projectId : string):Promise<any>;

    addMemberToProject(projectId: string, email: string): Promise<Project>;

    removeMemberFromProject(projectId: string, userId: string): Promise<boolean>;

    updateProject(projectId: string,
        projectName: string,
        status: string,
        priority: string
    ): Promise<boolean>;

    deleteProject(projectId: string, workSpaceId: string): Promise<any>;
}
