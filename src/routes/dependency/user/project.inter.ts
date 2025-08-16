import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";
import { AddMemberUseCase } from "../../../application/usecase/projectUseCase/addMember.usecase";
import { createProjectUseCase } from "../../../application/usecase/projectUseCase/createProject.usecase";
import { DeleteProjectUsecase } from "../../../application/usecase/projectUseCase/deleteProject.usecase";
import { GetAllProjectsInWorkspaceUseCase } from "../../../application/usecase/projectUseCase/getAllProjectsInWorkspace.usecase";
import { GetProjectUseCase } from "../../../application/usecase/projectUseCase/getProject.usecase";
import { ProjectStatsUseCase } from "../../../application/usecase/projectUseCase/projectstats.usecase";
import { RemoveMemberUseCase } from "../../../application/usecase/projectUseCase/removeMember.usecase";
import { RetrieveProjectUseCase } from "../../../application/usecase/projectUseCase/retrieveProject.usecase";
import { UpdateProjectUseCase } from "../../../application/usecase/projectUseCase/updateProject.usecase";
import { GetWorkSpaceUseCase } from "../../../application/usecase/workspaceUsecase/getWorkspace.usecase";
import { ProjectController } from "../../../controllers/user/project.controller";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IEmailService } from "../../../domain/services/email.interface";
import { ISecurePassword } from "../../../domain/services/securepassword.interface";
import { BacklogRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/backlog.repositoryImp";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { projectRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/project.repositoryImp";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { EmailServiceImp } from "../../../infrastructure/services/email.serviceImp";
import { SecurePasswordImp } from "../../../infrastructure/services/securepassword.serviceImp";
import { IProjectController } from "../../../interfaces/user/project.controller.interface";
import { addActivityUsecase } from "../user.di";


const userRepository: IUserRepository = new userRepositoryImp();
const projectRepository: IProjectRepository = new projectRepositoryImp(userRepository);
const emailService: IEmailService = new EmailServiceImp();
const securePassword: ISecurePassword = new SecurePasswordImp();
const backlogRepository: IBacklogRepository = new BacklogRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();

export const getTasksUsecase = new GetTasksUseCase(backlogRepository);
export const getWorkspaceUsecase = new GetWorkSpaceUseCase(companyRepository);
export const createProjectUsecase = new createProjectUseCase(projectRepository);
export const getProjectsInWorkspaceUsecase = new GetAllProjectsInWorkspaceUseCase(projectRepository);
export const getCurrentProjectUsecase = new GetProjectUseCase(projectRepository);
export const addMemberUsecase = new AddMemberUseCase(userRepository, emailService, projectRepository, securePassword);
export const removeMemberUsecase = new RemoveMemberUseCase(projectRepository);
export const updateProjectUsecase = new UpdateProjectUseCase(projectRepository, userRepository);
export const deleteProjectUsecase = new DeleteProjectUsecase(projectRepository);
export const projectStatsUse = new ProjectStatsUseCase(projectRepository);
export const retrieveProjectUsecase = new RetrieveProjectUseCase(projectRepository);

export const projectControllerInterface: IProjectController = new ProjectController(
    getWorkspaceUsecase,
    createProjectUsecase,
    getProjectsInWorkspaceUsecase,
    getCurrentProjectUsecase,
    getTasksUsecase,
    addMemberUsecase,
    removeMemberUsecase,
    updateProjectUsecase,
    deleteProjectUsecase,
    projectStatsUse,
    retrieveProjectUsecase,
    addActivityUsecase
)