
export interface IInitDashboard {
    execute(email: string, userId: string, role: 'admin' | 'user'): Promise<any>;
}