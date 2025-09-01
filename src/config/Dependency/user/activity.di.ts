
import { Activity } from "../../../infrastructure/database/models/activity.interface";


export interface IGetActivity {
    execute(companyId: string, projectId: string): Promise<Activity[]>;
}

export interface IAddActivity {
    execute(projectId: string, companyId: string, userId: string, action: string, target: string | null): Promise<void>;
}