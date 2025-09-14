
import { IRevenueUsecase } from "../../../config/Dependency/admin/revenue.di";
import { IRevenueRepository } from "../../../domain/repositories/adminRepo/revenue.repo";



export class RevenueUseCase implements IRevenueUsecase {

    constructor(private _revenueRepo: IRevenueRepository) { }

    async execute(filter: 'year' | 'month' | 'date' | null, plans: string[], startDate?: Date | null, endDate?: Date | null): Promise<any> {

        const data = await this._revenueRepo.getRevenueReport(filter, plans, startDate, endDate);
        const totalData: { totalCount: number, totalRevenue: number } = { totalCount: 0, totalRevenue: 0 };
        data.forEach((ele: { count: number, totalAmount: number, month?: number, date?: number }) => {
            totalData.totalCount = totalData.totalCount + ele.count;
            totalData.totalRevenue = totalData.totalRevenue + ele.totalAmount;
        });

        if (filter === 'year') {
            const revenueData = Array(12).fill(0);
            data.forEach((sub: { count: number, totalAmount: number, month: number }) => {
                const monthIndex = sub.month - 1;
                revenueData[monthIndex] = sub.totalAmount;
            });
            return { revenueData, totalData };
        } else if (filter === 'month') {

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


            const revenueData = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(Date.UTC(currentYear, currentMonth, i + 1));
                return { date: this.formatDate(date), totalAmount: 0 };
            });

            data.forEach((d: { date: string; count: number; totalAmount: number }) => {
                const normalizedDate = this.formatDate(new Date(d.date));
                const dayIndex = revenueData.findIndex(ele => ele.date === normalizedDate);

                if (dayIndex !== -1) {
                    revenueData[dayIndex] = { date: normalizedDate, totalAmount: d.totalAmount };
                }
            });

            return { revenueData, totalData };

        } else if (filter === 'date' && endDate && startDate) {

            const now = new Date();

            const diffTime = endDate.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

            const revenueData = Array.from({ length: diffDays }, (_, i) => {
                const starting = new Date(startDate);

                const date = new Date(Date.UTC(starting.getFullYear(), starting.getMonth(), starting.getDate() + i));
                return { date: this.formatDate(date), totalAmount: 0 };

            });


            data.forEach((d: { date: string; count: number; totalAmount: number }) => {
                const normalizedDate = this.formatDate(new Date(d.date));
                const dayIndex = revenueData.findIndex(ele => ele.date === normalizedDate);

                if (dayIndex !== -1) {
                    revenueData[dayIndex] = { date: normalizedDate, totalAmount: d.totalAmount };
                }
            });

            return { revenueData, totalData };
        }
        return data;
    }

    protected formatDate(date: Date) {
        return date.toISOString().split("T")[0];
    }

}