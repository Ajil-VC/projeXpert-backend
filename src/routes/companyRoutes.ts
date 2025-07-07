

import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { companyRegisterSchema, otpValidationSchema, registerSchema } from '../application/validator/authValidator';
import { AuthController } from '../controllers/authController';

const authController = new AuthController();

const companyRouter = express.Router();
companyRouter.use(express.urlencoded({ extended: true }));

companyRouter.post('/register', validateBody(companyRegisterSchema), authController.sendOtpToMail);
companyRouter.post('/resend-otp', validateBody(companyRegisterSchema), authController.sendOtpToMail);
companyRouter.post('/validate-otp', validateBody(otpValidationSchema), authController.validateOtp);
companyRouter.post('/create-company', validateBody(registerSchema), authController.createCompany);

export default companyRouter;