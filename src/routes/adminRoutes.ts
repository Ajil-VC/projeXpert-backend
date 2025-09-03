
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
import { revenueInterface } from './dependency/admin/revenue.inter';


const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));

adminRouter.get('/autherize-admin', authenticatePlatformAdmin, authInterface.isVerified);
adminRouter.post('/login', validateBody(signinSchema), authInterface.signIn);
adminRouter.get('/admin', authenticatePlatformAdmin, adminInitInterface.getAdminData);

adminRouter.get('/admin-init', authenticatePlatformAdmin, adminInitInterface.platFormData);
adminRouter.get('/dashboard', authenticatePlatformAdmin, adminInitInterface.dashBoard);

adminRouter.put('/change-user-status', authenticatePlatformAdmin, validateBody(changeUserStatusSchema), companyMangementInterface.changeUserStatus);
adminRouter.put('/change-company-status', authenticatePlatformAdmin, validateBody(changeCompanyStatusSchema), companyMangementInterface.changeCompanyStatus);
adminRouter.get('/notifications', authenticatePlatformAdmin, userInitInterface.getNotifications);
adminRouter.put('/update-profile', authenticatePlatformAdmin, upload.any(), userControllerInterface.updateProfile);

adminRouter.route('/plans')
    .post(authenticatePlatformAdmin, validateBody(createPlanSchema), stripeAdminInterface.createPlan)
    .get(authenticatePlatformAdmin, stripeAdminInterface.getAllPlans)
    .patch(authenticatePlatformAdmin, stripeAdminInterface.changePlanStatus)
    .delete(authenticatePlatformAdmin, stripeAdminInterface.deletePlan)

adminRouter.get('/subscriptions', authenticatePlatformAdmin, companyMangementInterface.getSubscriptions);

adminRouter.get('/revenue', authenticatePlatformAdmin, revenueInterface.getRevenueReport);

export default adminRouter;