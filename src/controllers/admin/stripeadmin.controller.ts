import { Request, Response, NextFunction } from "express";
import { IStripeAdminController } from "../../interfaces/admin/stripeadmin.controller.interface";
import { stripe } from "../../config/stripe.config";
import Stripe from 'stripe';
import { CreatePlanUseCase } from "../../application/usecase/admin/createPlan.usecase";
import { changePlanStatusCase, deletePlanCase, getPlansCase, subscriptionPlanUsecase } from "../../config/Dependency/admin/subscriptionplan.di";
import { HttpStatusCode } from "../../config/http-status.enum";
import { GetPlansUsecase } from "../../application/usecase/admin/getPlans.usecase";
import { DeletePlanUseCase } from "../../application/usecase/admin/deletePlan.usecase";
import { ChangePlanStatusUsecase } from "../../application/usecase/admin/changePlanStatus.usecase";


export class StripeAdminController implements IStripeAdminController {

    private subscriptionPlanUsecase: CreatePlanUseCase;
    private getPlansCase: GetPlansUsecase;
    private deletePlanCase: DeletePlanUseCase;
    private changePlanStatusCase: ChangePlanStatusUsecase;
    constructor() {
        this.subscriptionPlanUsecase = subscriptionPlanUsecase;
        this.getPlansCase = getPlansCase;
        this.deletePlanCase = deletePlanCase;
        this.changePlanStatusCase = changePlanStatusCase;
    }


    changePlanStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const planId = req.body.planId;
            const result = await this.changePlanStatusCase.execute(planId);

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
            await this.deletePlanCase.execute(planId);
            res.status(HttpStatusCode.NO_CONTENT);
            return;
        } catch (err) {
            next(err);
        }
    }


    getAllPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const page = req.query.page_num;
            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 6;
            const skip = (pageNum - 1) * limit;

            const result = await this.getPlansCase.execute(limit, skip);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {

            next(err);
        }
    }

    createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { name, price, billingCycle, description, maxWorkspace, maxProjects, maxMembers, canUseVideoCall } = req.body;

            const videoCall = canUseVideoCall === 'true' ? true : false;
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

            const result = await this.subscriptionPlanUsecase.execute(
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