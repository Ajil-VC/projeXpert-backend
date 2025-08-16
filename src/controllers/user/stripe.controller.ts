import { Request, Response, NextFunction } from "express";
import { IStripeController } from "../../interfaces/user/stripe.controller.interface";
import { stripe } from "../../config/stripe.config";
import Stripe from 'stripe';
import { HttpStatusCode } from "../../config/http-status.enum";
import { config } from "../../config/config";
import { ICompanySubscription, IGetSubscription, IIsPlanAvailable, ISubscribe } from "../../config/Dependency/user/subscription.di";


export class StripeController implements IStripeController {

    constructor(
        private subscribe: ISubscribe,
        private getSubscriptionplans: IGetSubscription,
        private isPlanAvailable: IIsPlanAvailable,
        private companySubscription: ICompanySubscription
    ) { }


    getSubscriptionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const page = req.query.page_num;
            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 6;
            const skip = (pageNum - 1) * limit;

            const result = await this.companySubscription.execute(req.user.companyId);

            if (!result.isExpired) {
                res.status(HttpStatusCode.OK).json({ status: true, result: result.company });
                return;
            }

            const plans = await this.getSubscriptionplans.execute(limit, skip);
            res.status(HttpStatusCode.OK).json({ status: false, plans });
            return;

        } catch (err) {
            next(err);
        }

    }


    verifySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const sessionId = req.params.sessionId;

        try {

            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
                expand: ['items.data.price.product']
            });

            const item = subscription.items.data[0];
            let planName = item.price.nickname;

            if (!planName && item.price.metadata?.plan_name) {
                planName = item.price.metadata.plan_name;
            }

            if (!planName) {
                const product = item.price.product;
                if (typeof product === 'object' && product && 'name' in product && !product.deleted) {
                    planName = product.name;
                } else if (typeof product === 'string') {
                    const fetchedProduct = await stripe.products.retrieve(product);
                    planName = fetchedProduct.name;
                }
            }

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

            const productId = item.price.product as string;
            const product = await stripe.products.retrieve(productId);

            const currentPeriodEnd = new Date(item.current_period_end * 1000);

            const result = await this.subscribe.execute(
                session.customer_email,
                customerId,
                subscriptionId,
                subscription.status,
                currentPeriodEnd,
                productId
            );

        }

        // if (event.type === 'invoice.payment_failed') { ... }

        res.status(HttpStatusCode.OK).send({ received: true });

    }


    checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const { priceId } = req.body;

        try {

            const isPlanAvailable = await this.isPlanAvailable.execute(priceId);
            if (!isPlanAvailable) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Plan is not avaialalbe currently.' });
                return;
            }

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