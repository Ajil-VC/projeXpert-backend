import { TeamRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/team.repositoryImp";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { GetTeamMembers } from "../../../application/usecase/teamManagement/getTeam.usecase";
import { GetUsersInCompany } from "../../../application/usecase/teamManagement/getusers.usecase";
import { RestrictUser } from "../../../application/usecase/teamManagement/restrictUser.usecase";

const teamRepository: ITeamRepository = new TeamRepositoryImp();
export const getTeammembersUsecase = new GetTeamMembers(teamRepository);
export const getCompanyUsersUsecase = new GetUsersInCompany(teamRepository);
export const restrictUserUsecase = new RestrictUser(teamRepository);