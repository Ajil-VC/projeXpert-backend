import { Request, Response, NextFunction } from "express";
import { PLAN_PERMISSIONS } from "../../config/planpermissions";
import { ISubscription } from "../../domain/repositories/subscription.repo";
import { HttpStatusCode } from "../../config/http-status.enum";
import { planPolicyUsecase } from "../../config/Dependency/user/subscription.di";
import { PlanPolicy } from "../../application/usecase/subscriptionUseCase/planpolicy.usecase";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export class PlanPolicyMiddleware {

    private planPolicyUsecase: PlanPolicy;
    constructor() {
        this.planPolicyUsecase = planPolicyUsecase;
    }

    checkPolicy = (operationType: 'createWorkspace' | 'createProject' | 'maxMembers' | 'canVideoCall') => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {

                if (!req?.user?.companyId) {
                    res.status(HttpStatusCode.UNAUTHORIZED).json({ status: false, message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED });
                    return;
                }

                const canContinue = await this.planPolicyUsecase.execute(req.user.companyId, operationType);

                if (!canContinue.status) {
                    res.status(HttpStatusCode.FORBIDDEN).json({ status: false, message: canContinue.message, issue: canContinue?.additional });
                    return;
                }

                next();

            } catch (err) {
                next(err);
            }
        };
    };

}