
import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";


export interface IGetDashBoardUsecase {
    execute(): Promise<any>;
}


export interface ICompanyManagementUsecase {
    execute(userId: string, status: boolean): Promise<any>;
}

export interface ICompanyStatusChangeUsecase {
    execute(companyId: string, status: boolean): Promise<any>;
}

export interface IGetSubscriptionAdminUsecase {
    execute(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>, totalPage: number }>;
}