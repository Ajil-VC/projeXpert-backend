

import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { companyRegisterSchema, otpValidationSchema, registerSchema } from '../../application/validator/authValidator';
import { createCompany, sendOtpToMail, validateOtp } from '../controllers/authController';


const companyRouter = express.Router();
companyRouter.use(express.urlencoded({ extended: true }));

companyRouter.post('/register', validateBody(companyRegisterSchema), sendOtpToMail);
companyRouter.post('/resend-otp', validateBody(companyRegisterSchema), sendOtpToMail);
companyRouter.post('/validate-otp', validateBody(otpValidationSchema), validateOtp);
companyRouter.post('/create-company', validateBody(registerSchema), createCompany);

export default companyRouter;