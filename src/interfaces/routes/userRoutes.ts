
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../../application/validator/authValidator';
import { changePassword, signIn } from '../controllers/authController';
import { getInitData } from '../controllers/user/userInit.controller';
import { authenticateAsAdmin, authenticateUser } from '../../infrastructure/middleware/user.middleware';

import {
    addMember, createProject, deleteProject,
    getProject, getProjectData, getProjectsInitData,
    removeMember, updateProject
} from '../controllers/user/project.controller';

import {
    assignIssueSchema, createEpicSchema,
    createIssueSchema, createSprintSchema,
    createWorkspaceSchema,
    dragDropSchema,
    projectCreationSchema,
    startSprintSchema,
    taskStatusUpdateSchema
} from '../../application/validator/user.validator';

import { assignIssue, changeTaskStatus, createEpic, createIssue, createSprint, dragDropUpdate, getSprints, getTasks, startSprint } from '../controllers/user/backlog.controller';
import { getTeam } from '../controllers/user/team.controller';
import { createWorkspace } from '../controllers/user/workspace.controller';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

userRouter.post('/login', validateBody(signinSchema), signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, changePassword);

userRouter.get('/init-data', authenticateUser, getInitData);
userRouter.get('/projects-initials', authenticateUser, getProjectsInitData);
userRouter.post('/create-project', validateBody(projectCreationSchema), authenticateAsAdmin, createProject);
userRouter.get('/init-projects', authenticateAsAdmin, getProjectData);
userRouter.get('/get-project', authenticateUser, getProject);
userRouter.post('/create-workspace',authenticateAsAdmin, validateBody(createWorkspaceSchema), createWorkspace);

userRouter.post('/add-member', authenticateAsAdmin, addMember);
userRouter.patch('/remove-member', authenticateAsAdmin, removeMember);
userRouter.put('/update-project', authenticateAsAdmin, updateProject);
userRouter.delete('/delete-project/:projectId/:workSpaceId', authenticateAsAdmin, deleteProject);

userRouter.post('/create-epic', authenticateAsAdmin, validateBody(createEpicSchema), createEpic);
userRouter.post('/create-issue', authenticateAsAdmin, validateBody(createIssueSchema), createIssue);
userRouter.post('/create-sprint', authenticateAsAdmin, validateBody(createSprintSchema), createSprint);
userRouter.get('/get-sprints/:projectId', authenticateUser, getSprints);
userRouter.get('/tasks', authenticateUser, getTasks);

userRouter.get('/team', authenticateAsAdmin, getTeam);
userRouter.patch('/assign-issue', authenticateAsAdmin, validateBody(assignIssueSchema), assignIssue);
userRouter.put('/update-task', authenticateAsAdmin, validateBody(dragDropSchema), dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateAsAdmin, validateBody(taskStatusUpdateSchema), changeTaskStatus);

userRouter.put('/start-sprint', authenticateAsAdmin, validateBody(startSprintSchema), startSprint);

export default userRouter;