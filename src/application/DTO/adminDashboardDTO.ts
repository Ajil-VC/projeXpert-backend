import { Doughnut } from "../../domain/entities/additional.interface.ts/doughnut.interface";
import { PlanData } from "../../domain/entities/additional.interface.ts/plandata.interface";
import { SummaryCard } from "../../domain/entities/additional.interface.ts/summarycard.interface";


export interface AdminDashBoardDTO {
    barChartData: Array<number>;
    summaryCards: SummaryCard[];
    doughnutChart: Doughnut;
    top5Companiesdata: {
        totalAmount: number,
        subscriptionCount: number,
        companyId: string,
        companyName: string
    }[];
    largestEmployer: LargestEmployerDTO[];
};


export interface AdminDashboardViewRepoDTO {

    activeCompanySubscriptions: number,
    companyCount:
    {
        totalCompanyCount: number,
        lastMonthJoinedCount: number
    },
    subscriptions: { count: number, totalAmount: number, month: number }[],
    planUsage: PlanData[]
    ,
    top5Companies:
    {
        totalAmount: number;
        subscriptionCount: number;
        companyId: string;
        companyName: string;
    }[]
}

export interface LargestEmployerDTO {
    employerCount: number;
    email: string;
    companyName: string;
}
