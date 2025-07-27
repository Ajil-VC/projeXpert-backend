import { ChangePlanStatusUsecase } from "../../../application/usecase/admin/changePlanStatus.usecase";
import { CreatePlanUseCase } from "../../../application/usecase/admin/createPlan.usecase";
import { DeletePlanUseCase } from "../../../application/usecase/admin/deletePlan.usecase";
import { GetPlansUsecase } from "../../../application/usecase/admin/getPlans.usecase";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { SubscriptionPlanImp } from "../../../infrastructure/repositories/adminRepo/subscriptionplan.repository";



const subscriptionRepo: ISubscriptionPlanRepository = new SubscriptionPlanImp();

export const subscriptionPlanUsecase = new CreatePlanUseCase(subscriptionRepo);
export const getPlansCase = new GetPlansUsecase(subscriptionRepo);
export const deletePlanCase = new DeletePlanUseCase(subscriptionRepo);
export const changePlanStatusCase = new ChangePlanStatusUsecase(subscriptionRepo);