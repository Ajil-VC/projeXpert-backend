import { HttpStatusCode } from "../../../config/http-status.enum";
import { PLAN_PERMISSIONS } from "../../../config/planpermissions";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { useCaseResult } from "../../shared/useCaseResult";


export class PlanPolicy {

    constructor(private subcription: ISubscription, private workspaceRepo: IWorkspaceRepository, private projectRepo: IProjectRepository) { }

    async execute(companyId: string, operationType: 'createWorkspace' | 'createProject'): Promise<useCaseResult> {

        const isSubscribed = await this.subcription.getSubscriptions(companyId);

        if (Array.isArray(isSubscribed) || !isSubscribed) {
            return { status: false, message: 'Please subscribe to a plan to perform this operation' };
        }

        const planPermissions = PLAN_PERMISSIONS[isSubscribed.plan];
        const operationPermission = planPermissions[operationType];

        if (operationType === 'createWorkspace') {

            const workspaceCount = await this.workspaceRepo.countWorkspace(companyId);
            if (workspaceCount >= operationPermission.limit) {
                return { status: false, message: `Current plan does not allow to create more than ${operationPermission.limit} workspace` };
            }

        } else if (operationType === 'createProject') {

            const projectCount = await this.projectRepo.countProjects(companyId);
            if (projectCount >= operationPermission.limit) {
                return { status: false, message: `Current plan does not allow to create more than ${operationPermission.limit} projects` };
            }

        }

        return { status: true, message: 'ok' };
    }
}