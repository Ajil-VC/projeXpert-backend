import { AdminInitUseCase } from "../../../application/usecase/admin/admininit.usecase";
import { GetAdminUseCase } from "../../../application/usecase/admin/getAdmin.usecase";
import { AdminController } from "../../../controllers/admin/adminInit.controller";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepo/admin.repository";
import { IAdminInitController } from "../../../interfaces/admin/adminInit.controller.interface";
import { getDashBoardData } from "./companymanage.inter";

const adminRepository: IAdminRepository = new AdminRepositoryImp();


export const adminInitUsecase = new AdminInitUseCase(adminRepository);
export const adminDataUsecase = new GetAdminUseCase(adminRepository);

export const adminInitInterface: IAdminInitController = new AdminController(adminInitUsecase, adminDataUsecase, getDashBoardData);