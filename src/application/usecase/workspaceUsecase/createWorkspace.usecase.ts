import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";


export class CreateWorkspaceUsecase{

    constructor(private workspaceRepo : IWorkspaceRepository){}

    async execute(workspaceName :string, companyId : string) : Promise<any>{
        

        const result = await this.workspaceRepo.createWorkspace(workspaceName, companyId);
        if(!result){
            throw new Error('Something went wrong while creating workspace');
        }
        
        return result;
    }
}