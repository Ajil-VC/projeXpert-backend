
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
}
