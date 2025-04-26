
import { Project } from "../entities/project.interface";


export interface IProjectRepository {

    createProject(
        projectName: String,
        workSpace: String,
        priority: String,
        companyId: String,
        memberId: String
    ): Promise<Project>;

    getProjects(workSpaceId: String): Promise<Array<any>>;

    addMemberToProject(projectId: string, email: string): Promise<Project>;

    updateProject(projectId: string,
        projectName: string,
        status: string,
        priority: string
    ): Promise<any>;

    deleteProject(projectId: string, workSpaceId: string): Promise<any>;
}
