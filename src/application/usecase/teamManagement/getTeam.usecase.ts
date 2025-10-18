import { IGetTeamMembersUsecase } from "../../../config/Dependency/user/team.di";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { Team } from "../../../infrastructure/database/models/team.interface";


export class GetTeamMembers implements IGetTeamMembersUsecase {

    constructor(private _teamRepo: ITeamRepository) { }

    async execute(projectId: string | null, userId: string): Promise<Team[]> {

        const result = await this._teamRepo.getTeamMembers(projectId, userId);
        return result;
    }
}