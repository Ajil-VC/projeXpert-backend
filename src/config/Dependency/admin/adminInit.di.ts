
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepo/admin.repository";
import { AdminInitUseCase } from "../../../application/usecase/admin/admininit.usecase";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { GetAdminUseCase } from "../../../application/usecase/admin/getAdmin.usecase";

const adminRepository: IAdminRepository = new AdminRepositoryImp();

export const adminInitUsecase = new AdminInitUseCase(adminRepository);
export const adminDataUsecase = new GetAdminUseCase(adminRepository);