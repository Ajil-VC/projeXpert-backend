import { InitDashBoardUseCase } from "../../../application/usecase/workspaceUsecase/initDashboard.usecase";
import { userRepositoryImp } from "../../../infrastructure/repositories/user.repositoryImp";
import { IUserRepository } from "../../../domain/repositories/user.repo";

const userRepository: IUserRepository = new userRepositoryImp();
export const initDashboardUsecase = new InitDashBoardUseCase(userRepository);