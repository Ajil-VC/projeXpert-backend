import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";


export class UpdateProjectUseCase {

    constructor(private projectRepo: IProjectRepository, private userRepo: IUserRepository) { }

    async execute(

        projectId: string,
        projectName: string,
        status: string,
        priority: string,
        members: Array<{ email: string, role: string }>,
        adminEmail: string): Promise<any> {

        const isRoleChanged = this.userRepo.updateRole(members, adminEmail);
        const isUpdated = this.projectRepo.updateProject(projectId, projectName, status, priority);

        const result = await Promise.all([isRoleChanged, isUpdated])

        if (!(result[0] && result[1])) throw new Error('Error occured while updating the project.');

        return true;

    }
}