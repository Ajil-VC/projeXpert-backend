import { CreateWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/createWorkspace.usecase";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { SelectWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/selectWorkspace.usecase";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";

const workSpaceRepository: IWorkspaceRepository = new WorkspaceRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();

export const createWorkspaceUsecase = new CreateWorkspaceUsecase(workSpaceRepository);
export const selectWorkSpace = new SelectWorkspaceUsecase(workSpaceRepository, userRepository);