import { Request, Response, NextFunction } from "express";
import { IStripeController } from "../../interfaces/user/stripe.controller.interface";
import { stripe } from "../../config/stripe.config";
import Stripe from 'stripe';
import { HttpStatusCode } from "../../config/http-status.enum";
import { config } from "../../config/config";
import { subscribe } from "../../config/Dependency/user/subscription.di";
import { SubscriptionUsecase } from "../../application/usecase/subscriptionUseCase/subscription.usecase";
import { getSubscription } from "../../config/Dependency/user/subscription.di";
import { GetSubscription } from "../../application/usecase/subscriptionUseCase/getSubscription.usecase";

export class StripeController implements IStripeController {

    private subscribe: SubscriptionUsecase;
    private getSubscription: GetSubscription;
    constructor() {

        this.subscribe = subscribe;
        this.getSubscription = getSubscription;
    }


    getSubscriptionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.getSubscription.execute(req.user.companyId);
            res.status(HttpStatusCode.OK).json({ status: true, result });

        } catch (err) {
            next(err);
        }

    }


    verifySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const sessionId = req.params.sessionId;

        try {

            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

            const planName = subscription.items.data[0].price.nickname || 'Pro';
            const billingCycle = subscription.items.data[0].price.recurring?.interval || 'monthly';

            res.json({ plan: planName, billingCycle });

        } catch (err) {
            next(err);
        }

    }

    webhookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const sig = req.headers['stripe-signature'] as string;

        let event: Stripe.Event;

        try {
            if (!config.STRIPE_WEBHOOK_SECRET) {
                throw new Error('Stripe secret key is undefined.');
            }
            event = stripe.webhooks.constructEvent(req.body, sig, config.STRIPE_WEBHOOK_SECRET);
        } catch (err) {

            res.status(HttpStatusCode.BAD_REQUEST).send(`Webhook Error`);
            return
        }


        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.customer_email) {
                throw new Error('Email I missing');
            }

            const customerId = session.customer as string;
            const subscriptionId = session.subscription as string;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                expand: ['items.data.price'],
            });

            const item = subscription.items.data[0];

            const currentPeriodEnd = new Date(item.current_period_end * 1000);
            const billingCycle = item.plan.interval || 'month';
            const planName = item.plan.nickname || 'Pro';

            const result = await this.subscribe.execute(
                session.customer_email,
                customerId,
                subscriptionId,
                planName,
                subscription.status,
                billingCycle,
                currentPeriodEnd
            );

        }

        // if (event.type === 'invoice.payment_failed') { ... }

        res.status(HttpStatusCode.OK).send({ received: true });

    }


    checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { priceId } = req.body;

        try {

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1
                }],
                customer_email: req.user.email,
                success_url: `http://localhost:4200/user/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: 'http://localhost:4200/user/cancel',
            });

            res.status(HttpStatusCode.OK).json({ url: session.url });
            return;

        } catch (err) {
            next(err);
        }
    }


}