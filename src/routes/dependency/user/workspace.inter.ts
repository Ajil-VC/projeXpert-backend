import { CreateWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/createWorkspace.usecase";
import { SelectWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/selectWorkspace.usecase";
import { ICreateWorkspace, ISelectWorkspace } from "../../../config/Dependency/user/workspace.di";
import { WorkSpaceController } from "../../../controllers/user/workspace.controller";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";
import { IWorkSpace } from "../../../interfaces/user/workspace.controller.interface";

const workSpaceRepository: IWorkspaceRepository = new WorkspaceRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();


export const createWorkspaceUsecase: ICreateWorkspace = new CreateWorkspaceUsecase(workSpaceRepository);

export const selectWorkSpace: ISelectWorkspace = new SelectWorkspaceUsecase(workSpaceRepository, userRepository);
export const workspaceInterface: IWorkSpace = new WorkSpaceController(createWorkspaceUsecase, selectWorkSpace);