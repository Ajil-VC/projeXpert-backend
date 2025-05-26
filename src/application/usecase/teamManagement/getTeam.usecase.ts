import { ITeamRepository } from "../../../domain/repositories/team.repo";


export class GetTeamMembers {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(projectId : string): Promise<any> {

        const result = await this.teamRepo.getTeamMembers(projectId);
        if(!result) {
            throw new Error("No team members found");
        }   

        return result;
    }
}