import { IGetDashBoardUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { Doughnut } from "../../../domain/entities/additional.interface.ts/doughnut.interface";
import { PlanData } from "../../../domain/entities/additional.interface.ts/plandata.interface";
import { SummaryCard } from "../../../domain/entities/additional.interface.ts/summarycard.interface";
import { IAdminDashboardRepository } from "../../../domain/repositories/adminRepo/dashboard.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { AdminDashBoardDTO } from "../../DTO/adminDashboardDTO";


export class GetDashboardDataUsecase implements IGetDashBoardUsecase {

    constructor(private _dashBoardRepo: IAdminDashboardRepository, private _userRepo: IUserRepository) { }

    async execute(): Promise<AdminDashBoardDTO> {

        const [data, largestEmployer] = await Promise.all([
            this._dashBoardRepo.getAdminDashboardView(),
            this._userRepo.largestEmployer()
        ]);
        console.log('data', data, 'asdf', largestEmployer);
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
                count: `₹${Number.isNaN(monthAvg) ? 0 : monthAvg}`,
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

        data.planUsage.forEach((plan: PlanData) => {
            doughnutChart.labels.push(plan.planName);
            doughnutChart.data.push(plan.usageCount)
        })

        return { barChartData, summaryCards, doughnutChart, top5Companiesdata: data.top5Companies, largestEmployer };

    }
}