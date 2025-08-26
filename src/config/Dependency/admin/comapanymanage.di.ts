
import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";


export interface IGetDashBoard {
    execute(): Promise<any>;
}


export interface ICompanyManagementUse {
    execute(userId: string, status: boolean): Promise<any>;
}

export interface ICompanyStatusChange {
    execute(companyId: string, status: boolean): Promise<any>;
}

export interface IGetSubscriptionAdmin {
    execute(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>, totalPage: number }>;
}