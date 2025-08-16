

import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { companyRegisterSchema, otpValidationSchema, registerSchema } from '../application/validator/authValidator';

import { authInterface } from './dependency/auth.inter';

const companyRouter = express.Router();
companyRouter.use(express.urlencoded({ extended: true }));

companyRouter.post('/register', validateBody(companyRegisterSchema), authInterface.sendOtpToMail);
companyRouter.post('/resend-otp', validateBody(companyRegisterSchema), authInterface.sendOtpToMail);
companyRouter.post('/validate-otp', validateBody(otpValidationSchema), authInterface.validateOtp);
companyRouter.post('/create-company', validateBody(registerSchema), authInterface.createCompany);

export default companyRouter;