import { RevenueUseCase } from "../../../application/usecase/admin/getRevenue.usecase";
import { IRevenueUsecase } from "../../../config/Dependency/admin/revenue.di";
import { RevenueController } from "../../../controllers/admin/revenue.controller";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import { IRevenueRepository } from "../../../domain/repositories/adminRepo/revenue.repo";
import { CompanySubscriptionRepositoryImp } from "../../../infrastructure/repositories/adminRepo/companysubscription.repository";
import { RevenueRepositoryImp } from "../../../infrastructure/repositories/adminRepo/revenue.repository";
import { IRevenueController } from "../../../interfaces/admin/revenue.controller.interface";


const companysubscriptionRepo: ICompanySubscriptionRepository = new CompanySubscriptionRepositoryImp();
const revenueRepo: IRevenueRepository = new RevenueRepositoryImp(companysubscriptionRepo);
const revenueUsecase: IRevenueUsecase = new RevenueUseCase(revenueRepo);

export const revenueInterface: IRevenueController = new RevenueController(revenueUsecase);