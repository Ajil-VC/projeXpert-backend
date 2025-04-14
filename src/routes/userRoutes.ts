
import express from 'express';
const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));
import { authenticateUser } from '../middleware/user.middleware';


import { gen_otp, signIn, validateOtp } from '../controllers/common';
import { createProfile, getInitData } from '../controllers/user';

userRouter.post('/signup', gen_otp);
userRouter.post('/resend-otp', gen_otp);
userRouter.post('/validate-otp', validateOtp);
userRouter.post('/create-profile', createProfile);
userRouter.post('/login', signIn);

userRouter.get('/init-data', authenticateUser, getInitData);

export default userRouter;