
import express from 'express';
import bodyParser from 'body-parser';
import { StripeController } from '../controllers/user/stripe.controller';

const webhookRouter = express.Router();
const stripeController = new StripeController();

webhookRouter.post('/', bodyParser.raw({ type: 'application/json' }), stripeController.webhookHandler);
export default webhookRouter;