

export interface IRevenueRepository {

    getRevenueReport(filter: 'year' | 'month' | 'date' | null, plans: string[], startDate?: Date | null, endDate?: Date | null): Promise<any>;
}