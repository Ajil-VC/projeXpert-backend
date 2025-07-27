
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { authenticatePlatformAdmin } from '../infrastructure/middleware/admin.middleware';
import { AdminController } from '../controllers/admin/adminInit.controller';
import { changeCompanyStatusSchema, changeUserStatusSchema, createPlanSchema, signinSchema } from '../application/validator/authValidator';
import { AuthController } from '../controllers/authController';
import { CompanyManagementController } from '../controllers/admin/companymanage.controller';
import { UserInitController } from '../controllers/user/userInit.controller';
import { userController } from '../controllers/user/user.controller';
import { upload } from '../infrastructure/middleware/multer.middleware';
import { StripeAdminController } from '../controllers/admin/stripeadmin.controller';

const authController = new AuthController();
const adminInitController = new AdminController();
const userInitController = new UserInitController();
const companyManagementController = new CompanyManagementController();
const userControllerOb = new userController();
const stripeController = new StripeAdminController();

const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));

adminRouter.get('/autherize-admin', authenticatePlatformAdmin, authController.isVerified);
adminRouter.post('/login', validateBody(signinSchema), authController.signIn);
adminRouter.get('/admin', authenticatePlatformAdmin, adminInitController.getAdminData);
adminRouter.get('/admin-init', authenticatePlatformAdmin, adminInitController.platFormData);
adminRouter.put('/change-user-status', authenticatePlatformAdmin, validateBody(changeUserStatusSchema), companyManagementController.changeUserStatus);
adminRouter.put('/change-company-status', authenticatePlatformAdmin, validateBody(changeCompanyStatusSchema), companyManagementController.changeCompanyStatus);
adminRouter.get('/get-notifications', authenticatePlatformAdmin, userInitController.getNotifications);
adminRouter.put('/update-profile', authenticatePlatformAdmin, upload.any(), userControllerOb.updateProfile);

adminRouter.post('/create-plan', authenticatePlatformAdmin, validateBody(createPlanSchema), stripeController.createPlan);
adminRouter.delete('/delete-plan', authenticatePlatformAdmin, stripeController.deletePlan);
adminRouter.patch('/change-plan-status', authenticatePlatformAdmin, stripeController.changePlanStatus);
adminRouter.get('/get-plans', authenticatePlatformAdmin, stripeController.getAllPlans);
adminRouter.get('/get-subscriptions', authenticatePlatformAdmin, companyManagementController.getSubscriptions);

export default adminRouter;