import { IGetPlanUsecase } from "../../../config/Dependency/admin/subscriptionplan.di";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/adminRepo/subscriptionplan.repo";
import { GetPlansDTO } from "../../DTO/getPlansDTO";




export class GetPlansUsecase implements IGetPlanUsecase {

    constructor(private _subscriptionRepo: ISubscriptionPlanRepository) { }

    async execute(limit: number, skip: number, searchTerm: string): Promise<GetPlansDTO> {


        const plansWithTotalPage = await this._subscriptionRepo.getAllPlans(limit, skip, searchTerm);
        return plansWithTotalPage;
    }
}