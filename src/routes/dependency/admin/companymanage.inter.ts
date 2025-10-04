import { GetDashboardDataUsecase } from "../../../application/usecase/admin/dashboard.usecase";
import { GetSubscriptions } from "../../../application/usecase/admin/getSubscriptionDetails.usecase";
import { ChangeCompanyStatusUsecase } from "../../../application/usecase/admin/updateCompanyStatus.usecase";
import { changeUserStatusUseCase } from "../../../application/usecase/admin/updateUserStatus.usecase";
import { ICompanyManagementUsecase, ICompanyStatusChangeUsecase, IGetDashBoardUsecase, IGetSubscriptionAdminUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { CompanyManagementController } from "../../../controllers/admin/companymanage.controller";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { IAdminDashboardRepository } from "../../../domain/repositories/adminRepo/dashboard.repo";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { CompanySubscriptionRepositoryImp } from "../../../infrastructure/repositories/adminRepo/companysubscription.repository";
import { DashboardRepositoryImp } from "../../../infrastructure/repositories/adminRepo/dashboard.repository";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { ICompanyManagementController } from "../../../interfaces/admin/company.controller.interface";

const userRepository: IUserRepository = new userRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();

const companySubscriptionRepo: ICompanySubscriptionRepository = new CompanySubscriptionRepositoryImp();
const companyRepo: ICompanyRepository = new CompanyRepositoryImp();
const dashboardRepository: IAdminDashboardRepository = new DashboardRepositoryImp(companySubscriptionRepo, companyRepo);

export const getDashBoardData: IGetDashBoardUsecase = new GetDashboardDataUsecase(dashboardRepository, userRepository);
export const companyManagementUsecase: ICompanyManagementUsecase = new changeUserStatusUseCase(userRepository);
export const companyStatusChangeUsecase: ICompanyStatusChangeUsecase = new ChangeCompanyStatusUsecase(companyRepository);
export const getSubscriptionsusecase: IGetSubscriptionAdminUsecase = new GetSubscriptions(companySubscriptionRepo);

export const companyMangementInterface: ICompanyManagementController = new CompanyManagementController(
    companyManagementUsecase,
    companyStatusChangeUsecase,
    getSubscriptionsusecase);