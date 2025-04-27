
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../../application/validator/authValidator';
import { changePassword, signIn } from '../controllers/authController';
import { getInitData } from '../controllers/user/userInit.controller';
import { authenticateAsAdmin, authenticateUser } from '../../infrastructure/middleware/user.middleware';
import { addMember, createProject, deleteProject, getProjectData, getProjectsInitData, removeMember, updateProject } from '../controllers/user/project.controller';
import { projectCreationSchema } from '../../application/validator/user.validator';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

userRouter.post('/login', validateBody(signinSchema), signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, changePassword);

userRouter.get('/init-data', authenticateUser, getInitData);
userRouter.get('/projects-initials', authenticateUser, getProjectsInitData);
userRouter.post('/create-project', validateBody(projectCreationSchema), authenticateAsAdmin, createProject);
userRouter.get('/init-projects', authenticateAsAdmin, getProjectData);

userRouter.post('/add-member', authenticateAsAdmin, addMember);
userRouter.patch('/remove-member', authenticateAsAdmin, removeMember);
userRouter.put('/update-project', authenticateAsAdmin, updateProject);
userRouter.delete('/delete-project/:projectId/:workSpaceId', authenticateAsAdmin, deleteProject);

export default userRouter;