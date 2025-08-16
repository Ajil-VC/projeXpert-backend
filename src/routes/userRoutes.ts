
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../application/validator/authValidator';
import { authenticateAsAdmin, authenticateUser } from '../infrastructure/middleware/user.middleware';

import {
    assignIssueSchema, completeSprintSchema, controlSchema, createEpicSchema,
    createIssueSchema, createSprintSchema,
    createWorkspaceSchema,
    dragDropSchema,
    meetingSchema,
    projectCreationSchema,
    sendMessageSchema,
    startConversationSchema,
    startSprintSchema,
    taskStatusUpdateSchema,
    updateEpicSchema
} from '../application/validator/user.validator';


import { upload } from '../infrastructure/middleware/multer.middleware';
import { PlanPolicyMiddleware } from '../infrastructure/middleware/planpolicy.middleware';

import { getActivitiesInterface } from './dependency/user.di';
import { backlogControllerInterface } from './dependency/user/backlog.inter';
import { chatControllerInterface } from './dependency/user/chat.inter';
import { projectControllerInterface } from './dependency/user/project.inter';
import { userInitInterface } from './dependency/user/userinit.inter';
import { groupCallInterface } from './dependency/user/groupcall.inter';
import { subscriptionInterface } from './dependency/user/subscription.inter';
import { teamInterface } from './dependency/user/team.inter';
import { userControllerInterface } from './dependency/user.di';
import { workspaceInterface } from './dependency/user/workspace.inter';
import { authInterface } from './dependency/auth.inter';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

const planPolicyMiddleware = new PlanPolicyMiddleware();

userRouter.get('/authenticate-user', authenticateUser, authInterface.isVerified);
userRouter.post('/login', validateBody(signinSchema), authInterface.signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, authInterface.changePassword);
userRouter.post('/refresh-token', authInterface.refreshToken);

userRouter.get('/subscription', authenticateUser, subscriptionInterface.getSubscriptionDetails);
userRouter.post('/checkout', authenticateUser, subscriptionInterface.checkout);
userRouter.get('/stripe/session/:sessionId', authenticateUser, subscriptionInterface.verifySubscription);

userRouter.get('/get-notifications', authenticateUser, userInitInterface.getNotifications);
userRouter.patch('/update-notificaions', authenticateUser, userInitInterface.updateNotification);

userRouter.get('/init-data', authenticateUser, userInitInterface.getInitData);
userRouter.get('/projects-initials', authenticateUser, projectControllerInterface.getProjectsInitData);
userRouter.post('/create-project', validateBody(projectCreationSchema), authenticateAsAdmin, planPolicyMiddleware.checkPolicy('createProject'), projectControllerInterface.createProject);
userRouter.get('/init-projects', authenticateAsAdmin, projectControllerInterface.getProjectData);
userRouter.get('/get-project', authenticateUser, projectControllerInterface.getProject);
userRouter.get('/project', authenticateUser, projectControllerInterface.retrieveProject);
userRouter.post('/create-workspace', authenticateAsAdmin, validateBody(createWorkspaceSchema), planPolicyMiddleware.checkPolicy('createWorkspace'), workspaceInterface.createWorkspace);
userRouter.get('/get-workspace', authenticateUser, workspaceInterface.getWorkspace);

userRouter.put('/update-profile', authenticateUser, upload.any(), userControllerInterface.updateProfile);
userRouter.get('/dashboard/:projectId', authenticateUser, projectControllerInterface.projectStats);

userRouter.post('/add-member', authenticateAsAdmin, planPolicyMiddleware.checkPolicy('maxMembers'), projectControllerInterface.addMember);
userRouter.patch('/remove-member', authenticateAsAdmin, projectControllerInterface.removeMember);
userRouter.put('/update-project', authenticateAsAdmin, projectControllerInterface.updateProject);
userRouter.delete('/delete-project/:projectId/:workSpaceId', authenticateAsAdmin, projectControllerInterface.deleteProject);

userRouter.post('/create-epic', authenticateAsAdmin, validateBody(createEpicSchema), backlogControllerInterface.createEpic);
userRouter.put('/update-epic', authenticateAsAdmin, validateBody(updateEpicSchema), backlogControllerInterface.updateEpic);
userRouter.post('/create-issue', authenticateAsAdmin, validateBody(createIssueSchema), backlogControllerInterface.createIssue);
userRouter.post('/create-sprint', authenticateAsAdmin, validateBody(createSprintSchema), backlogControllerInterface.createSprint);
userRouter.get('/get-sprints/:projectId', authenticateAsAdmin, backlogControllerInterface.getSprints);
userRouter.get('/get-sprints/kanban/:projectId', authenticateUser, backlogControllerInterface.getSprints);
userRouter.get('/tasks', authenticateUser, backlogControllerInterface.getTasks);
userRouter.get('/tasks/kanban', authenticateUser, backlogControllerInterface.getTasks);
userRouter.get('/get-comments', authenticateUser, backlogControllerInterface.getComments);
userRouter.post('/add-comment', authenticateUser, backlogControllerInterface.addComment);
userRouter.patch('/control-user', authenticateAsAdmin, validateBody(controlSchema), teamInterface.restrictUser);

userRouter.get('/get-users', authenticateAsAdmin, teamInterface.getCompanyUsers);
userRouter.get('/team', authenticateUser, teamInterface.getTeam);
userRouter.patch('/assign-issue', authenticateAsAdmin, validateBody(assignIssueSchema), backlogControllerInterface.assignIssue);
userRouter.put('/update-task', authenticateAsAdmin, validateBody(dragDropSchema), backlogControllerInterface.dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateUser, validateBody(taskStatusUpdateSchema), backlogControllerInterface.changeTaskStatus);
userRouter.put('/update-task-details', authenticateUser, upload.any(), backlogControllerInterface.updateTaskDetails);
userRouter.delete('/delete-attachment', authenticateUser, backlogControllerInterface.deleteCloudinaryAttachment);

userRouter.put('/start-sprint', authenticateAsAdmin, validateBody(startSprintSchema), backlogControllerInterface.startSprint);
userRouter.put('/complete-sprint', authenticateUser, validateBody(completeSprintSchema), backlogControllerInterface.completeSprint);

userRouter.post('/start-conversation', authenticateUser, validateBody(startConversationSchema), chatControllerInterface.startConversation);
userRouter.get('/get-chats', authenticateUser, chatControllerInterface.getChats);
userRouter.get('/get-messages/:convoId', authenticateUser, chatControllerInterface.getMessages);
userRouter.post('/send-message', authenticateUser, validateBody(sendMessageSchema), chatControllerInterface.sendMessage);
userRouter.get('/activity', authenticateUser, getActivitiesInterface.getActivity);

userRouter.get('/get-zegotoken', authenticateUser, groupCallInterface.getCallToken);
userRouter.post('/create-room', authenticateUser, validateBody(meetingSchema), groupCallInterface.createRoom);
userRouter.get('/get-upcoming-meetings', authenticateUser, groupCallInterface.getUpcomingMeetings);
userRouter.delete('/remove-meeting', authenticateUser, groupCallInterface.removeMeeting);

export default userRouter;