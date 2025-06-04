
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { authenticatePlatformAdmin } from '../../infrastructure/middleware/admin.middleware';
import { platFormData } from '../controllers/admin/adminInit.controller';
import { changeUserStatusSchema, signinSchema } from '../../application/validator/authValidator';
import { isVerified, signIn } from '../controllers/authController';
import { changeUserStatus } from '../controllers/admin/companymanage.controller';


const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));

adminRouter.get('/autherize-admin', authenticatePlatformAdmin, isVerified);
adminRouter.post('/login', validateBody(signinSchema), signIn);
adminRouter.get('/admin-init', authenticatePlatformAdmin, platFormData);
adminRouter.put('/change-user-status', authenticatePlatformAdmin, validateBody(changeUserStatusSchema), changeUserStatus);

export default adminRouter;