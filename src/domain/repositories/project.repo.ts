
import { Project } from "../../infrastructure/database/models/project.interface";
import { Task } from "../../infrastructure/database/models/task.interface";


export interface IProjectRepository {

    createProject(
        projectName: String,
        workSpace: String,
        priority: String,
        companyId: String,
        memberId: String
    ): Promise<Project>;

    getProjects(workSpaceId: String, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }>;

    getCurProject(workspaceId: string, projectId: string): Promise<any>;

    addMemberToProject(projectId: string, email: string, workSpaceId: string): Promise<Project>;

    removeMemberFromProject(projectId: string, userId: string): Promise<boolean>;

    updateProject(projectId: string,
        projectName: string,
        status: string,
        priority: string
    ): Promise<Project>;

    deleteProject(projectId: string, workSpaceId: string): Promise<any>;

    projectStats(projectId: string, userId: string, userRole: 'admin' | 'user'): Promise<Task[]>;

    countProjects(companyId: string): Promise<number>;

}
