import { AdminDashboardViewRepoDTO } from "../../../application/DTO/adminDashboardDTO";





export interface IAdminDashboardRepository {

    getAdminDashboardView(): Promise<AdminDashboardViewRepoDTO>;
}