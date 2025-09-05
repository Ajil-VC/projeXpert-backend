
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";
import { useCaseResult } from "../../shared/useCaseResult";


export class PlanPolicy {

    constructor(private teamRepo: ITeamRepository, private company: ICompanyRepository, private workspaceRepo: IWorkspaceRepository, private projectRepo: IProjectRepository) { }

    async execute(companyId: string, operationType: 'createWorkspace' | 'createProject' | 'maxMembers' | 'canVideoCall'): Promise<useCaseResult> {

        const companyData = await this.company.findCompanyById(companyId);
        const membersCount = (await this.teamRepo.getCompanyUsers(companyId)).users.length;
        const subscriptionPlan = companyData.plan as unknown as Subscription;


        if (companyData.subscriptionStatus !== 'active' || !companyData.plan) {
            if (operationType === 'maxMembers') {
                if (membersCount < 3) {
                    return { status: true, message: 'ok' };
                }
                return { status: false, message: 'Please subscribe to a plan to add more members' };
            } else if (operationType === 'createProject') {

                const projectCount = await this.projectRepo.countProjects(companyId);
                if (projectCount < 1) {
                    return { status: true, message: 'ok' };
                }

            }
            return { status: false, message: 'Please subscribe to a plan to perform this operation' };

        } else if (operationType === 'maxMembers') {

            if (membersCount >= subscriptionPlan.maxMembers) {
                return { status: false, message: `Current plan does not allow to add more than ${subscriptionPlan.maxMembers} members`, additional: 'Maximum members exceed' };
            }

        } else if (operationType === 'createWorkspace') {

            const workspaceCount = await this.workspaceRepo.countWorkspace(companyId);
            if (workspaceCount >= subscriptionPlan.maxWorkspace) {
                return { status: false, message: `Current plan does not allow to create more than ${subscriptionPlan.maxWorkspace} workspace`, additional: 'Maximum workspace exceed' };
            }

        } else if (operationType === 'createProject') {

            const projectCount = await this.projectRepo.countProjects(companyId);
            if (projectCount >= subscriptionPlan.maxProjects) {
                return { status: false, message: `Current plan does not allow to create more than ${subscriptionPlan.maxProjects} projects`, additional: 'Maximum projects exceed' };
            }

        } else if (operationType === 'canVideoCall') {
            return { status: false, message: `Current plan does not allow to make video calls`, additional: 'Call Restriction' };
        }

        return { status: true, message: 'ok' };
    }
}