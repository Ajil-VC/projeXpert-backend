
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { otpValidationSchema, registerSchema, signinSchema, signupSchema } from '../../application/validator/authValidator';
import { createProfile, sendOtpToMail, signIn, validateOtp } from '../controllers/authController';
import { getInitData } from '../controllers/user/userInit.controller';
import { authenticateUser } from '../../infrastructure/middleware/user.middleware';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));




userRouter.post('/signup', validateBody(signupSchema), sendOtpToMail);
userRouter.post('/resend-otp', validateBody(signupSchema), sendOtpToMail);
userRouter.post('/validate-otp', validateBody(otpValidationSchema), validateOtp);
userRouter.post('/create-profile', validateBody(registerSchema), createProfile);
userRouter.post('/login', validateBody(signinSchema), signIn);

userRouter.get('/init-data', authenticateUser, getInitData);

export default userRouter;