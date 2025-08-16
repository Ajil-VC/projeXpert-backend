import { GetCompanySubscription } from "../../../application/usecase/companyUsecase/getCompanySubscription.usecase";
import { GetSubscriptionPlans } from "../../../application/usecase/subscriptionUseCase/getSubscription.usecase";
import { IsPlanAvailableUseCase } from "../../../application/usecase/subscriptionUseCase/isPlanAvailable.usecase";
import { PlanPolicy } from "../../../application/usecase/subscriptionUseCase/planpolicy.usecase";
import { SubscriptionUsecase } from "../../../application/usecase/subscriptionUseCase/subscription.usecase";
import { ICompanySubscription, IGetSubscription, IIsPlanAvailable, ISubscribe } from "../../../config/Dependency/user/subscription.di";
import { StripeController } from "../../../controllers/user/stripe.controller";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { CompanyRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/company.repositoryImp";
import { projectRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/project.repositoryImp";
import { SubscriptionImp } from "../../../infrastructure/repositories/repoImplementations/subscriptoin.repositoryImp";
import { TeamRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/team.repositoryImp";
import { userRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/user.repositoryImp";
import { WorkspaceRepoImp } from "../../../infrastructure/repositories/repoImplementations/workspace.repositoryImp";
import { IStripeController } from "../../../interfaces/user/stripe.controller.interface";


const userRepo: IUserRepository = new userRepositoryImp();
const teamRepo: ITeamRepository = new TeamRepositoryImp();
const companyRepository: ICompanyRepository = new CompanyRepositoryImp();
const subscriptionRepository: ISubscription = new SubscriptionImp();
const workspaceRepo: IWorkspaceRepository = new WorkspaceRepoImp();
const projectRepo: IProjectRepository = new projectRepositoryImp(userRepo);

export const planPolicyUsecase = new PlanPolicy(teamRepo, companyRepository, workspaceRepo, projectRepo);
export const subscribe: ISubscribe = new SubscriptionUsecase(companyRepository, subscriptionRepository);
export const getSubscription: IGetSubscription = new GetSubscriptionPlans(subscriptionRepository);
export const isPlanAvailable: IIsPlanAvailable = new IsPlanAvailableUseCase(subscriptionRepository);
export const companySubscription: ICompanySubscription = new GetCompanySubscription(companyRepository);

export const subscriptionInterface: IStripeController = new StripeController(subscribe, getSubscription, isPlanAvailable, companySubscription);