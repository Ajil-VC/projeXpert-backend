import { CreateWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/createWorkspace.usecase";
import { SelectWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/selectWorkspace.usecase";
import { ICreateWorkspaceUsecase, ISelectWorkspaceUsecase } from "../../../config/Dependency/user/workspace.di";
import { WorkSpaceController } from "../../../controllers/user/workspace.controller";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";
import { IWorkSpaceController } from "../../../interfaces/user/workspace.controller.interface";

const workSpaceRepository: IWorkspaceRepository = new WorkspaceRepoImp();
const userRepository: IUserRepository = new userRepositoryImp();


export const createWorkspaceUsecase: ICreateWorkspaceUsecase = new CreateWorkspaceUsecase(workSpaceRepository);

export const selectWorkSpace: ISelectWorkspaceUsecase = new SelectWorkspaceUsecase(workSpaceRepository, userRepository);
export const workspaceInterface: IWorkSpaceController = new WorkSpaceController(createWorkspaceUsecase, selectWorkSpace);