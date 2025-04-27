import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class RemoveMemberUseCase {

    constructor(private projectRepo: IProjectRepository) { }

    async execute(projectId: string, userId: string, currUserId: string): Promise<boolean> {

        if(userId === currUserId){
            return false;
        }
        const result = await this.projectRepo.removeMemberFromProject(projectId, userId);
        if (!result) throw new Error('Couldnt remove member from project');
        return true;
    }

}