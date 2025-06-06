import { CreateWorkspaceUsecase } from "../../../application/usecase/workspaceUsecase/createWorkspace.usecase";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/workspace.repositoryImp";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";

const workSpaceRepository: IWorkspaceRepository = new WorkspaceRepoImp();

export const createWorkspaceUsecase = new CreateWorkspaceUsecase(workSpaceRepository);