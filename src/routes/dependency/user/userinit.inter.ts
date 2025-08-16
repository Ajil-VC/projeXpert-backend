import { InitDashBoardUseCase } from "../../../application/usecase/workspaceUsecase/initDashboard.usecase";
import { UserInitController } from "../../../controllers/user/userInit.controller";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { getNotificationsUse, readNotifications } from "./notification.inter";

const userRepository: IUserRepository = new userRepositoryImp();
export const initDashboardUsecase = new InitDashBoardUseCase(userRepository);

export const userInitInterface = new UserInitController(initDashboardUsecase, getNotificationsUse, readNotifications);