
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { authenticatePlatformAdmin } from '../infrastructure/middleware/admin.middleware';
import { changeCompanyStatusSchema, changeUserStatusSchema, createPlanSchema, signinSchema } from '../application/validator/authValidator';

import { upload } from '../infrastructure/middleware/multer.middleware';

import { userInitInterface } from './dependency/user/userinit.inter';
import { userControllerInterface } from './dependency/user.di';
import { authInterface } from './dependency/auth.inter';
import { adminInitInterface } from './dependency/admin/admininit.inter';
import { companyMangementInterface } from './dependency/admin/companymanage.inter';
import { stripeAdminInterface } from './dependency/admin/subscriptionplan.inter';


const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));

adminRouter.get('/autherize-admin', authenticatePlatformAdmin, authInterface.isVerified);
adminRouter.post('/login', validateBody(signinSchema), authInterface.signIn);
adminRouter.get('/admin', authenticatePlatformAdmin, adminInitInterface.getAdminData);

adminRouter.get('/admin-init', authenticatePlatformAdmin, adminInitInterface.platFormData);
adminRouter.get('/dashboard', authenticatePlatformAdmin, adminInitInterface.dashBoard);

adminRouter.put('/change-user-status', authenticatePlatformAdmin, validateBody(changeUserStatusSchema), companyMangementInterface.changeUserStatus);
adminRouter.put('/change-company-status', authenticatePlatformAdmin, validateBody(changeCompanyStatusSchema), companyMangementInterface.changeCompanyStatus);
adminRouter.get('/get-notifications', authenticatePlatformAdmin, userInitInterface.getNotifications);
adminRouter.put('/update-profile', authenticatePlatformAdmin, upload.any(), userControllerInterface.updateProfile);

adminRouter.post('/create-plan', authenticatePlatformAdmin, validateBody(createPlanSchema), stripeAdminInterface.createPlan);
adminRouter.delete('/delete-plan', authenticatePlatformAdmin, stripeAdminInterface.deletePlan);
adminRouter.patch('/change-plan-status', authenticatePlatformAdmin, stripeAdminInterface.changePlanStatus);
adminRouter.get('/get-plans', authenticatePlatformAdmin, stripeAdminInterface.getAllPlans);
adminRouter.get('/get-subscriptions', authenticatePlatformAdmin, companyMangementInterface.getSubscriptions);

export default adminRouter;