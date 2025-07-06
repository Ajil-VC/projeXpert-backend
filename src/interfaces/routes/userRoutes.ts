
import express from 'express';
import { validateBody } from '../../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../../application/validator/authValidator';
import { changePassword, isVerified, refreshToken, signIn } from '../controllers/authController';
import { getInitData, getNotifications, updateNotification } from '../controllers/user/userInit.controller';
import { authenticateAsAdmin, authenticateUser } from '../../infrastructure/middleware/user.middleware';

import {
    addMember, createProject, deleteProject,
    getProject, getProjectData, getProjectsInitData,
    removeMember, updateProject
} from '../controllers/user/project.controller';

import {
    assignIssueSchema, completeSprintSchema, createEpicSchema,
    createIssueSchema, createSprintSchema,
    createWorkspaceSchema,
    dragDropSchema,
    projectCreationSchema,
    sendMessageSchema,
    startConversationSchema,
    startSprintSchema,
    taskStatusUpdateSchema,
    updateEpicSchema
} from '../../application/validator/user.validator';

import { addComment, assignIssue, changeTaskStatus, completeSprint, createEpic, createIssue, createSprint, deleteCloudinaryAttachment, dragDropUpdate, getComments, getSprints, getTasks, startSprint, updateEpic, updateTaskDetails } from '../controllers/user/backlog.controller';
import { getTeam } from '../controllers/user/team.controller';
import { createWorkspace } from '../controllers/user/workspace.controller';
import { getChats, getMessages, sendMessage, startConversation } from '../controllers/user/chat.controller';

import { upload } from '../../infrastructure/middleware/multer.middleware';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

userRouter.get('/authenticate-user', authenticateUser, isVerified);
userRouter.post('/login', validateBody(signinSchema), signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, changePassword);
userRouter.post('/refresh-token', refreshToken);

userRouter.get('/get-notifications', authenticateUser, getNotifications);
userRouter.patch('/update-notificaions', authenticateUser, updateNotification);

userRouter.get('/init-data', authenticateUser, getInitData);
userRouter.get('/projects-initials', authenticateUser, getProjectsInitData);
userRouter.post('/create-project', validateBody(projectCreationSchema), authenticateAsAdmin, createProject);
userRouter.get('/init-projects', authenticateAsAdmin, getProjectData);
userRouter.get('/get-project', authenticateUser, getProject);
userRouter.post('/create-workspace', authenticateAsAdmin, validateBody(createWorkspaceSchema), createWorkspace);

userRouter.post('/add-member', authenticateAsAdmin, addMember);
userRouter.patch('/remove-member', authenticateAsAdmin, removeMember);
userRouter.put('/update-project', authenticateAsAdmin, updateProject);
userRouter.delete('/delete-project/:projectId/:workSpaceId', authenticateAsAdmin, deleteProject);

userRouter.post('/create-epic', authenticateAsAdmin, validateBody(createEpicSchema), createEpic);
userRouter.put('/update-epic', authenticateAsAdmin, validateBody(updateEpicSchema), updateEpic);
userRouter.post('/create-issue', authenticateAsAdmin, validateBody(createIssueSchema), createIssue);
userRouter.post('/create-sprint', authenticateAsAdmin, validateBody(createSprintSchema), createSprint);
userRouter.get('/get-sprints/:projectId', authenticateAsAdmin, getSprints);
userRouter.get('/get-sprints/kanban/:projectId', authenticateUser, getSprints);
userRouter.get('/tasks', authenticateUser, getTasks);
userRouter.get('/tasks/kanban', authenticateUser, getTasks);
userRouter.get('/get-comments', authenticateUser, getComments);
userRouter.post('/add-comment',authenticateUser, addComment);

userRouter.get('/team', authenticateUser, getTeam);
userRouter.patch('/assign-issue', authenticateAsAdmin, validateBody(assignIssueSchema), assignIssue);
userRouter.put('/update-task', authenticateAsAdmin, validateBody(dragDropSchema), dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateUser, validateBody(taskStatusUpdateSchema), changeTaskStatus);
userRouter.put('/update-task-details', authenticateUser, upload.any(), updateTaskDetails);
userRouter.delete('/delete-attachment', authenticateUser, deleteCloudinaryAttachment);

userRouter.put('/start-sprint', authenticateAsAdmin, validateBody(startSprintSchema), startSprint);
userRouter.put('/complete-sprint', authenticateUser, validateBody(completeSprintSchema), completeSprint);

userRouter.post('/start-conversation', authenticateUser, validateBody(startConversationSchema), startConversation);
userRouter.get('/get-chats/:projectId', authenticateUser, getChats);
userRouter.get('/get-messages/:convoId', authenticateUser, getMessages);
userRouter.post('/send-message', authenticateUser, validateBody(sendMessageSchema), sendMessage);

export default userRouter;