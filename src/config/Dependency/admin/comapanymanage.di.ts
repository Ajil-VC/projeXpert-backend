
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { changeUserStatusUseCase } from "../../../application/usecase/admin/updateUserStatus.usecase";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ChangeCompanyStatusUsecase } from "../../../application/usecase/admin/updateCompanyStatus.usecase";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";

import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { SubscriptionImp } from "../../../infrastructure/repositories/repoImplementations/subscriptoin.repositoryImp";
import { GetSubscriptions } from "../../../application/usecase/admin/getSubscriptionDetails.usecase";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepo/admin.repository";

const userRepository: IUserRepository = new userRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const adminRepository: IAdminRepository = new AdminRepositoryImp();

export const companyManagementUsecase = new changeUserStatusUseCase(userRepository);
export const companyStatusChangeUsecase = new ChangeCompanyStatusUsecase(companyRepository);
export const getSubscriptionsusecase = new GetSubscriptions(adminRepository);