
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { changeUserStatusUseCase } from "../../../application/usecase/admin/updateUserStatus.usecase";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ChangeCompanyStatusUsecase } from "../../../application/usecase/admin/updateCompanyStatus.usecase";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";

import { GetSubscriptions } from "../../../application/usecase/admin/getSubscriptionDetails.usecase";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepo/admin.repository";
import { GetDashboardDataUsecase } from "../../../application/usecase/admin/dashboard.usecase";
import { IAdminDashboardRepository } from "../../../domain/repositories/adminRepo/dashboard.repo";
import { DashboardRepositoryImp } from "../../../infrastructure/repositories/adminRepo/dashboard.repository";
import { CompanySubscriptionRepositoryImp } from "../../../infrastructure/repositories/adminRepo/companysubscription.repository";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";

const userRepository: IUserRepository = new userRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const adminRepository: IAdminRepository = new AdminRepositoryImp();

const companySubscriptionRepo: ICompanySubscriptionRepository = new CompanySubscriptionRepositoryImp();
const companyRepo: ICompanyRepository = new CompanyRepositoryImp();
const dashboardRepository: IAdminDashboardRepository = new DashboardRepositoryImp(companySubscriptionRepo, companyRepo);

export const companyManagementUsecase = new changeUserStatusUseCase(userRepository);
export const companyStatusChangeUsecase = new ChangeCompanyStatusUsecase(companyRepository);
export const getSubscriptionsusecase = new GetSubscriptions(adminRepository);
export const getDashBoardData = new GetDashboardDataUsecase(dashboardRepository);