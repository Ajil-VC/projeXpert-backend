
export interface IInitDashboardUsecase {
    execute(email: string, userId: string, role: 'admin' | 'user'): Promise<any>;
}