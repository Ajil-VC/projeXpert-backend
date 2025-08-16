import { GetTeamMembers } from "../../../application/usecase/teamManagement/getTeam.usecase";
import { GetUsersInCompany } from "../../../application/usecase/teamManagement/getusers.usecase";
import { RestrictUser } from "../../../application/usecase/teamManagement/restrictUser.usecase";
import { IGetCompanyUsers, IGetTeamMembers, IRestrictUser } from "../../../config/Dependency/user/team.di";
import { TeamController } from "../../../controllers/user/team.controller";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { TeamRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/team.repositoryImp";
import { ITeamController } from "../../../interfaces/user/team.controller.interface";


const teamRepository: ITeamRepository = new TeamRepositoryImp();

export const getTeammembersUsecase: IGetTeamMembers = new GetTeamMembers(teamRepository);
export const getCompanyUsersUsecase: IGetCompanyUsers = new GetUsersInCompany(teamRepository);
export const restrictUserUsecase: IRestrictUser = new RestrictUser(teamRepository);

export const teamInterface: ITeamController = new TeamController(getTeammembersUsecase, getCompanyUsersUsecase, restrictUserUsecase);