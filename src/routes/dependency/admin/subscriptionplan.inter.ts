import { ChangePlanStatusUsecase } from "../../../application/usecase/admin/changePlanStatus.usecase";
import { CreatePlanUseCase } from "../../../application/usecase/admin/createPlan.usecase";
import { DeletePlanUseCase } from "../../../application/usecase/admin/deletePlan.usecase";
import { GetPlansUsecase } from "../../../application/usecase/admin/getPlans.usecase";
import { IChangePlanStatusUsecase, IDeletePlanUsecase, IGetPlanUsecase, ISubscriptionPlanUsecase } from "../../../config/Dependency/admin/subscriptionplan.di";
import { StripeAdminController } from "../../../controllers/admin/stripeadmin.controller";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { SubscriptionPlanImp } from "../../../infrastructure/repositories/adminRepo/subscriptionplan.repository";
import { IStripeAdminController } from "../../../interfaces/admin/stripeadmin.controller.interface";

const subscriptionRepo: ISubscriptionPlanRepository = new SubscriptionPlanImp();


export const subscriptionPlanUsecase: ISubscriptionPlanUsecase = new CreatePlanUseCase(subscriptionRepo);
export const getPlansCase: IGetPlanUsecase = new GetPlansUsecase(subscriptionRepo);
export const deletePlanCase: IDeletePlanUsecase = new DeletePlanUseCase(subscriptionRepo);
export const changePlanStatusCase: IChangePlanStatusUsecase = new ChangePlanStatusUsecase(subscriptionRepo);

export const stripeAdminInterface: IStripeAdminController = new StripeAdminController(
    subscriptionPlanUsecase,
    getPlansCase,
    deletePlanCase,
    changePlanStatusCase);