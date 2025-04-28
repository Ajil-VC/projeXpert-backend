import { PopulatedUser } from "../../../domain/entities/populatedUser.interface";
import { Project } from "../../../domain/entities/project.interface";
import { WorkSpace } from "../../../domain/entities/workspace.interface";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export class InitDashBoardUseCase {

    constructor(
        private userRepo: IUserRepository
    ) { }

    async execute(email: string, userId: string, role : 'admin' | 'user') {

        const userData = await this.userRepo.findByEmail(email);

        const unknownTypeWorkSpace = userData?.defaultWorkspace as unknown;
        const populatedWorkspace = unknownTypeWorkSpace as WorkSpace;
        const unknownTypeProjects = populatedWorkspace.projects as unknown;
        const populatedProjects = unknownTypeProjects as Array<Project>;

        const resDefaultWorkspace = JSON.parse(JSON.stringify(populatedWorkspace));
        resDefaultWorkspace.projects = populatedProjects;

        const unknownTypeUserData = userData as unknown;
        const convertedUserData : PopulatedUser = unknownTypeUserData as PopulatedUser;
        convertedUserData.defaultWorkspace = resDefaultWorkspace;
        

        if(role === 'user'){

            const projectsUserIn = populatedProjects.filter(item => {
                for(const user of item.members){
                    const userUnknownId = user as unknown;
                    const userIdString = String(userUnknownId);
                    if(userIdString === userId) return item;
                }
            });


            convertedUserData.defaultWorkspace.projects = projectsUserIn;

        }

        return convertedUserData;

    }
}