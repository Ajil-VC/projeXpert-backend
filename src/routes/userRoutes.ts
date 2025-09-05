
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../application/validator/authValidator';
import { authenticateAsAdmin, authenticateUser } from '../infrastructure/middleware/user.middleware';

import {
    assignIssueSchema, completeSprintSchema, controlSchema, createEpicSchema,
    createIssueSchema, createSprintSchema,
    createSubtaskSchema,
    createWorkspaceSchema,
    dragDropSchema,
    meetingSchema,
    projectCreationSchema,
    roleSchema,
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
import { AuthorizeMiddleware } from '../infrastructure/middleware/authorize.middleware';


const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

const planPolicyMiddleware = new PlanPolicyMiddleware();
const autherizer = new AuthorizeMiddleware();

userRouter.get('/authenticate-user', authenticateUser, authInterface.isVerified);
userRouter.post('/login', validateBody(signinSchema), authInterface.signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, authInterface.changePassword);
userRouter.post('/refresh-token', authInterface.refreshToken);

userRouter.get('/subscription', authenticateUser, autherizer.execute(['manage_billing']), subscriptionInterface.getSubscriptionDetails);
userRouter.post('/checkout', authenticateUser, subscriptionInterface.checkout);
userRouter.get('/stripe/session/:sessionId', authenticateUser, subscriptionInterface.verifySubscription);


userRouter.route('/notifications')
    .get(authenticateUser, userInitInterface.getNotifications)
    .patch(authenticateUser, userInitInterface.updateNotification)

userRouter.get('/init-data', authenticateUser, userInitInterface.getInitData);
userRouter.get('/projects-initials', authenticateUser, autherizer.execute(['view_project']), projectControllerInterface.getProjectsInitData);
userRouter.get('/init-projects', authenticateAsAdmin, autherizer.execute(['view_project']), projectControllerInterface.getProjectData);
userRouter.get('/get-project', authenticateUser, autherizer.execute(['view_project']), projectControllerInterface.getProject);

userRouter.route('/roles')
    .post(authenticateUser, autherizer.execute(['assign_role']), validateBody(roleSchema), userControllerInterface.createRole)
    .get(authenticateUser, autherizer.execute(['assign_role']), userControllerInterface.getRoles);

userRouter.delete('/project/:projectId/:workSpaceId', authenticateAsAdmin, projectControllerInterface.deleteProject);
userRouter.route('/project')
    .post(validateBody(projectCreationSchema), authenticateAsAdmin, planPolicyMiddleware.checkPolicy('createProject'), projectControllerInterface.createProject)
    .put(authenticateAsAdmin, projectControllerInterface.updateProject)
    .get(authenticateUser, projectControllerInterface.retrieveProject);

userRouter.route('/workspace')
    .get(authenticateUser, workspaceInterface.getWorkspace)
    .post(authenticateAsAdmin, validateBody(createWorkspaceSchema), planPolicyMiddleware.checkPolicy('createWorkspace'), workspaceInterface.createWorkspace)

userRouter.put('/profile', authenticateUser, upload.any(), userControllerInterface.updateProfile);
userRouter.get('/dashboard/:projectId', authenticateUser, projectControllerInterface.projectStats);

userRouter.route('/member')
    .post(authenticateAsAdmin, planPolicyMiddleware.checkPolicy('maxMembers'), projectControllerInterface.addMember)
    .patch(authenticateAsAdmin, projectControllerInterface.removeMember);

userRouter.route('/epic')
    .post(authenticateAsAdmin, validateBody(createEpicSchema), backlogControllerInterface.createEpic)
    .put(authenticateAsAdmin, validateBody(updateEpicSchema), backlogControllerInterface.updateEpic);

userRouter.route('/issue')
    .post(authenticateAsAdmin, validateBody(createIssueSchema), backlogControllerInterface.createIssue)
    .patch(authenticateUser, validateBody(assignIssueSchema), backlogControllerInterface.assignIssue)

userRouter.post('/subtask', authenticateAsAdmin, validateBody(createSubtaskSchema), backlogControllerInterface.createSubtask);
userRouter.get('/subtask/:parentId', authenticateUser, backlogControllerInterface.getSubtasks);
userRouter.delete('/task/:taskId', authenticateAsAdmin, backlogControllerInterface.removeTask);

userRouter.route('/sprints')
    .post(authenticateAsAdmin, validateBody(createSprintSchema), backlogControllerInterface.createSprint)
    .put(authenticateAsAdmin, validateBody(startSprintSchema), backlogControllerInterface.startSprint);
userRouter.put('/complete-sprint', authenticateUser, validateBody(completeSprintSchema), backlogControllerInterface.completeSprint);

userRouter.get('/sprints/:projectId', authenticateAsAdmin, backlogControllerInterface.getSprints);
userRouter.get('/sprints/kanban/:projectId', authenticateUser, backlogControllerInterface.getSprints);

userRouter.route('/comments')
    .get(authenticateUser, backlogControllerInterface.getComments)
    .post(authenticateUser, backlogControllerInterface.addComment);
userRouter.get('/tasks', authenticateUser, backlogControllerInterface.getTasks);
userRouter.get('/tasks/kanban', authenticateUser, backlogControllerInterface.getTasks);
userRouter.patch('/control-user', authenticateAsAdmin, validateBody(controlSchema), teamInterface.restrictUser);
userRouter.get('/task-history', authenticateUser, backlogControllerInterface.taskHistory);

userRouter.get('/get-users', authenticateAsAdmin, teamInterface.getCompanyUsers);
userRouter.get('/team', authenticateUser, teamInterface.getTeam);
userRouter.put('/update-task', authenticateAsAdmin, validateBody(dragDropSchema), backlogControllerInterface.dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateUser, validateBody(taskStatusUpdateSchema), backlogControllerInterface.changeTaskStatus);
userRouter.put('/update-task-details', authenticateUser, upload.any(), backlogControllerInterface.updateTaskDetails);
userRouter.delete('/delete-attachment', authenticateUser, backlogControllerInterface.deleteCloudinaryAttachment);


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