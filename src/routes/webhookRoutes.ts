
import express from 'express';
import bodyParser from 'body-parser';
import { subscriptionInterface } from './dependency/user/subscription.inter';

const webhookRouter = express.Router();


webhookRouter.post('/', bodyParser.raw({ type: 'application/json' }), subscriptionInterface.webhookHandler);
export default webhookRouter;