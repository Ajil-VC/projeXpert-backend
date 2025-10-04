
import { Project } from "../../infrastructure/database/models/project.interface";
import { Task } from "../../infrastructure/database/models/task.interface";


export interface IProjectRepository {

    createProject(
        projectName: string,
        workSpace: string,
        priority: string,
        companyId: string,
        memberId: string
    ): Promise<Project>;

    retrieveProject(projectId: string): Promise<Project>;

    getProjects(workSpaceId: string, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }>;

    getCurProject(workspaceId: string, projectId: string): Promise<any>;

    addMemberToProject(projectId: string, email: string, workSpaceId: string): Promise<Project>;

    removeMemberFromProject(projectId: string, userId: string): Promise<boolean>;

    updateProject(projectId: string,
        projectName: string,
        status: string,
        priority: string
    ): Promise<Project>;

    deleteProject(projectId: string, workSpaceId: string): Promise<boolean>;

    projectStats(projectId: string, userId: string, userRole: 'admin' | 'user', companyId: string): Promise<Task[]>;

    countProjects(companyId: string): Promise<number>;


}
