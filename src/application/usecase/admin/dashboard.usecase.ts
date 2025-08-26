import { IGetDashBoard } from "../../../config/Dependency/admin/comapanymanage.di";
import { Doughnut } from "../../../domain/entities/additional.interface.ts/doughnut.interface";
import { SummaryCard } from "../../../domain/entities/additional.interface.ts/summarycard.interface";
import { IAdminDashboardRepository } from "../../../domain/repositories/adminRepo/dashboard.repo";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";


export class GetDashboardDataUsecase implements IGetDashBoard {

    constructor(private dashBoardRepo: IAdminDashboardRepository, private userRepo: IUserRepository, private projectRepo: IProjectRepository) { }

    async execute(): Promise<any> {

        const [data, largestEmployer, avgProjectsOnPlans] = await Promise.all([
            this.dashBoardRepo.getAdminDashboardView(),
            this.userRepo.largestEmployer(),
            this.projectRepo.avgProjectsOnPlans()
        ]);

        const totalMonth = data.subscriptions.length;
        const yearTotalRevenue = data.subscriptions.reduce((acc: number, curr: { count: number, totalAmount: number, month: number }) => {
            acc = acc + curr.totalAmount;
            return acc;
        }, 0);
        const monthAvg = yearTotalRevenue / totalMonth;
        const lastMonth = data.subscriptions.reduce((acc: { count: number, totalAmount: number, month: number }, curr: { count: number, totalAmount: number, month: number }) => {
            if (acc.month < curr.month) {
                return curr;
            }
            return acc;
        }, { count: 0, totalAmount: 0, month: 0 });

        const summaryCards: SummaryCard[] = [
            {
                count: data.companyCount.totalCompanyCount,
                label: 'Total Companies',
                sublabel: `${data.companyCount.lastMonthJoinedCount} from last month`,
                icon: 'fa-check-circle',
                color: 'green'
            },
            {
                count: data.activeCompanySubscriptions,
                label: 'Active Subscriptions',
                sublabel: 'In current month',
                icon: 'fa-pencil-alt',
                color: 'blue'
            },
            {
                count: `₹${monthAvg}`,
                label: 'Monthly Average',
                sublabel: `₹${lastMonth.totalAmount} from last month`,
                icon: 'fa-calendar-check',
                color: 'orange'
            },
            {
                count: `₹${yearTotalRevenue}`,
                label: 'This year',
                sublabel: `Total collected amount`,
                icon: 'fa-calendar-check',
                color: 'orange'
            }

        ];

        const barChartData = Array(12).fill(0);
        data.subscriptions.forEach((sub: { count: number, totalAmount: number, month: number }) => {
            const monthIndex = sub.month - 1;
            barChartData[monthIndex] = sub.totalAmount;
        });

        const doughnutChart: Doughnut = {
            labels: [],
            data: []
        };

        data.planUsage.forEach((plan: { usageCount: number, planId: any, planName: string, planAmount: number }) => {
            doughnutChart.labels.push(plan.planName);
            doughnutChart.data.push(plan.usageCount)
        })

        return { barChartData, summaryCards, doughnutChart, top5Companiesdata: data.top5Companies, largestEmployer };

    }
}