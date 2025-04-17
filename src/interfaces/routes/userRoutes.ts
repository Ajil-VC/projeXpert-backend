
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { signinSchema } from '../../application/validator/authValidator';
import { signIn } from '../controllers/authController';
import { getInitData } from '../controllers/user/userInit.controller';
import { authenticateUser } from '../../infrastructure/middleware/user.middleware';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));


userRouter.post('/login', validateBody(signinSchema), signIn);
userRouter.get('/init-data', authenticateUser, getInitData);

export default userRouter;