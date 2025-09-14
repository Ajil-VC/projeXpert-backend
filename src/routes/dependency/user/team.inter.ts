import { GetTeamMembers } from "../../../application/usecase/teamManagement/getTeam.usecase";
import { GetUsersInCompany } from "../../../application/usecase/teamManagement/getusers.usecase";
import { UpdateUserRoleUseCase } from "../../../application/usecase/teamManagement/update_user_role_and_status.usecase";
import { IGetCompanyUsersUsecase, IGetTeamMembersUsecase, IUpdateUserRoleAndStatusUsecase } from "../../../config/Dependency/user/team.di";
import { TeamController } from "../../../controllers/user/team.controller";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { TeamRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/team.repositoryImp";
import { ITeamController } from "../../../interfaces/user/team.controller.interface";


const teamRepository: ITeamRepository = new TeamRepositoryImp();

export const getTeammembersUsecase: IGetTeamMembersUsecase = new GetTeamMembers(teamRepository);
export const getCompanyUsersUsecase: IGetCompanyUsersUsecase = new GetUsersInCompany(teamRepository);
export const restrictUserUsecase: IUpdateUserRoleAndStatusUsecase = new UpdateUserRoleUseCase(teamRepository);

export const teamInterface: ITeamController = new TeamController(getTeammembersUsecase, getCompanyUsersUsecase, restrictUserUsecase);