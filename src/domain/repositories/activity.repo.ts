import { Activity } from "../../infrastructure/database/models/activity.interface";



export interface IActivityRepository {
    addActivity(projectId: string, companyId: string, userId: string, action: string, target: string): Promise<void>;

    getActivities(companyId: string, projectId: string): Promise<Activity[]>;
}