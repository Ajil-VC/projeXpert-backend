

import { GetWorkSpaceUseCase } from "../../../application/usecase/workspaceUsecase/getWorkspace.usecase";
import { createProjectUseCase } from "../../../application/usecase/projectUseCase/createProject.usecase";
import { GetAllProjectsInWorkspaceUseCase } from "../../../application/usecase/projectUseCase/getAllProjectsInWorkspace.usecase";
import { AddMemberUseCase } from "../../../application/usecase/projectUseCase/addMember.usecase";
import { DeleteProjectUsecase } from "../../../application/usecase/projectUseCase/deleteProject.usecase";
import { UpdateProjectUseCase } from "../../../application/usecase/projectUseCase/updateProject.usecase";
import { RemoveMemberUseCase } from "../../../application/usecase/projectUseCase/removeMember.usecase";
import { GetProjectUseCase } from "../../../application/usecase/projectUseCase/getProject.usecase";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";

import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";

import { projectRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/project.repositoryImp";
import { IProjectRepository } from "../../../domain/repositories/project.repo";

import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { IUserRepository } from "../../../domain/repositories/user.repo";

import { EmailServiceImp } from "../../../infrastructure/services/email.serviceImp";
import { IEmailService } from "../../../domain/services/email.interface";

import { SecurePasswordImp } from "../../../infrastructure/services/securepassword.serviceImp";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";

import { BacklogRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/backlog.repositoryImp";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { ProjectStatsUseCase } from "../../../application/usecase/projectUseCase/projectstats.usecase";

const workspaceRepository: IWorkspaceRepository = new WorkspaceRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();
const projectRepository: IProjectRepository = new projectRepositoryImp(userRepository);
const emailService: IEmailService = new EmailServiceImp();
const securePassword: ISecurePassword = new SecurePasswordImp();
const backlogRepository: IBacklogRepository = new BacklogRepositoryImp();


export const getWorkspaceUsecase = new GetWorkSpaceUseCase(workspaceRepository);
export const createProjectUsecase = new createProjectUseCase(projectRepository);
export const getProjectsInWorkspaceUsecase = new GetAllProjectsInWorkspaceUseCase(projectRepository);
export const getCurrentProjectUsecase = new GetProjectUseCase(projectRepository);
export const addMemberUsecase = new AddMemberUseCase(userRepository, emailService, projectRepository, securePassword);
export const removeMemberUsecase = new RemoveMemberUseCase(projectRepository);
export const updateProjectUsecase = new UpdateProjectUseCase(projectRepository, userRepository);
export const deleteProjectUsecase = new DeleteProjectUsecase(projectRepository);
export const getTasksUsecase = new GetTasksUseCase(backlogRepository);
export const projectStatsUse = new ProjectStatsUseCase(projectRepository);