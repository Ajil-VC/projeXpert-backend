import { Request, Response, NextFunction } from "express";
import { IStripeAdminController } from "../../interfaces/admin/stripeadmin.controller.interface";
import { stripe } from "../../config/stripe.config";
import { IChangePlanStatusUsecase, IDeletePlanUsecase, IGetPlanUsecase, ISubscriptionPlanUsecase } from "../../config/Dependency/admin/subscriptionplan.di";
import { HttpStatusCode } from "../../config/http-status.enum";



export class StripeAdminController implements IStripeAdminController {

    constructor(
        private _subscriptionPlanUsecase: ISubscriptionPlanUsecase,
        private _getPlansCase: IGetPlanUsecase,
        private _deletePlanCase: IDeletePlanUsecase,
        private _changePlanStatusCase: IChangePlanStatusUsecase
    ) { }


    changePlanStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const planId = req.body.planId;
            const result = await this._changePlanStatusCase.execute(planId);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    deletePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const planId = req.query.plan_id;
            if (typeof planId !== 'string') throw new Error('Plan Id should be a string');
            await this._deletePlanCase.execute(planId);
            res.status(HttpStatusCode.OK).json({ status: true, message: 'Plan deleted successfully' });
            return;
        } catch (err) {
            next(err);
        }
    }


    getAllPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const page = req.query.page_num;
            const searchTerm = typeof req.query.searchTerm !== 'string' || req.query.searchTerm === 'undefined' ? '' : req.query.searchTerm;
            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 3;
            const skip = (pageNum - 1) * limit;

            const result = await this._getPlansCase.execute(limit, skip, searchTerm);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { name, price, billingCycle, description, maxWorkspace, maxProjects, maxMembers } = req.body;

            const videoCall = true;
            const product = await stripe.products.create({
                name,
                description,
            });

            const stripePrice = await stripe.prices.create({
                unit_amount: Math.round(price * 100),
                currency: 'inr',
                recurring: { interval: billingCycle },
                product: product.id,
            });

            const result = await this._subscriptionPlanUsecase.execute(
                name,
                description,
                product.id,
                stripePrice.id,
                price,
                billingCycle,
                maxWorkspace,
                maxProjects,
                maxMembers,
                videoCall);
            res.status(HttpStatusCode.CREATED).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

}