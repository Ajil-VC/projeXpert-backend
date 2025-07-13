
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { changeUserStatusUseCase } from "../../../application/usecase/admin/updateUserStatus.usecase";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { ChangeCompanyStatusUsecase } from "../../../application/usecase/admin/updateCompanyStatus.usecase";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";

const userRepository: IUserRepository = new userRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();

export const companyManagementUsecase = new changeUserStatusUseCase(userRepository);
export const companyStatusChangeUsecase = new ChangeCompanyStatusUsecase(companyRepository);