import { config } from './config';
import Stripe from 'stripe';

if (!config.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in the configuration.');
}

export const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});