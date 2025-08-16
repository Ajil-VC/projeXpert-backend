import { IGetTeamMembers } from "../../../config/Dependency/user/team.di";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { Team } from "../../../infrastructure/database/models/team.interface";


export class GetTeamMembers implements IGetTeamMembers {

    constructor(private teamRepo: ITeamRepository) { }

    async execute(projectId: string | null, userId: string): Promise<Array<Team>> {

        const result = await this.teamRepo.getTeamMembers(projectId, userId);
        return result;
    }
}