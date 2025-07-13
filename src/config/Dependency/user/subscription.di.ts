import { GetSubscription } from "../../../application/usecase/subscriptionUseCase/getSubscription.usecase";
import { PlanPolicy } from "../../../application/usecase/subscriptionUseCase/planpolicy.usecase";
import { SubscriptionUsecase } from "../../../application/usecase/subscriptionUseCase/subscription.usecase";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { projectRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/project.repositoryImp";
import { SubscriptionImp } from "../../../infrastructure/repositories/repoImplementations/subscriptoin.repositoryImp";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";

const userRepo: IUserRepository = new userRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const subscriptionRepository: ISubscription = new SubscriptionImp();
const workspaceRepo: IWorkspaceRepository = new WorkspaceRepoImp();
const projectRepo: IProjectRepository = new projectRepositoryImp(userRepo);

export const subscribe = new SubscriptionUsecase(companyRepository, subscriptionRepository);
export const getSubscription = new GetSubscription(subscriptionRepository);
export const planPolicyUsecase = new PlanPolicy(subscriptionRepository, workspaceRepo, projectRepo);