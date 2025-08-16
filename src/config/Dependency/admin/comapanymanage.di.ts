

import { Company } from "../../../infrastructure/database/models/company.interface";


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
    execute(): Promise<Company[]>;
}