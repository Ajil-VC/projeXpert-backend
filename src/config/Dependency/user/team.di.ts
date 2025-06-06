import { TeamRepositoryImp } from "../../../infrastructure/repositories/team.repositoryImp";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { GetTeamMembers } from "../../../application/usecase/teamManagement/getTeam.usecase";

const teamRepository: ITeamRepository = new TeamRepositoryImp();
export const getTeammembersUsecase = new GetTeamMembers(teamRepository);