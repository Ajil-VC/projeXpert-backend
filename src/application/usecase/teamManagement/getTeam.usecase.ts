import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { Team } from "../../../infrastructure/database/models/team.interface";


export class GetTeamMembers {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(projectId: string, userId: string): Promise<Array<Team>> {

        const result = await this.teamRepo.getTeamMembers(projectId, userId);

        if (!result) {
            throw new Error("No team members found");
        }

        return result;
    }
}