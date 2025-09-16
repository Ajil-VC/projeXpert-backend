
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../application/validator/authValidator';
import { authenticateUser } from '../infrastructure/middleware/user.middleware';

import {
    addMemberSchema,
    assignIssueSchema, completeSprintSchema, controlSchema, createEpicSchema,
    createIssueSchema, createSprintSchema,
    createSubtaskSchema,
    createWorkspaceSchema,
    dragDropSchema,
    meetingSchema,
    projectCreationSchema,
    roleEditSchema,
    roleSchema,
    sendMessageSchema,
    startConversationSchema,
    startSprintSchema,
    storyPointSchema,
    taskStatusUpdateSchema,
    updateEpicSchema
} from '../application/validator/user.validator';


import { upload } from '../infrastructure/middleware/multer.middleware';
import { planPolicyMiddleware } from './dependency/middleware.inter';
import { autherizer } from './dependency/middleware.inter';
import { issue } from './dependency/middleware.inter';

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

userRouter.get('/authenticate-user', authenticateUser, authInterface.isVerified);
userRouter.post('/login', validateBody(signinSchema), authInterface.signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, authInterface.changePassword);
userRouter.post('/refresh-token', authInterface.refreshToken);

userRouter.get('/subscription', authenticateUser, autherizer.has(['manage_billing']), subscriptionInterface.getSubscriptionDetails);
userRouter.post('/checkout', authenticateUser, autherizer.has(['manage_billing']), subscriptionInterface.checkout);
userRouter.get('/stripe/session/:sessionId', authenticateUser, autherizer.has(['manage_billing']), subscriptionInterface.verifySubscription);


userRouter.route('/notifications')
    .get(authenticateUser, userInitInterface.getNotifications)
    .patch(authenticateUser, userInitInterface.updateNotification)

userRouter.get('/init-data', authenticateUser, userInitInterface.getInitData);
userRouter.get('/projects-initials', authenticateUser, autherizer.has(['create_project']), projectControllerInterface.getProjectsInitData);
userRouter.get('/init-projects', authenticateUser,
    autherizer.hasAny(['view_project', 'edit_project', 'create_project', 'invite_user', 'remove_user', 'assign_role']), projectControllerInterface.getProjectData);
userRouter.get('/get-project', authenticateUser, projectControllerInterface.getProject);

userRouter.route('/roles')
    .post(authenticateUser, autherizer.has(['assign_role']), validateBody(roleSchema), userControllerInterface.createRole)
    .put(authenticateUser, autherizer.has(['assign_role']), validateBody(roleEditSchema), userControllerInterface.updateRoleData)
    .get(authenticateUser, autherizer.has(['assign_role']), userControllerInterface.getRoles)
    .delete(authenticateUser, autherizer.has(['assign_role']), userControllerInterface.deleteRole);

userRouter.delete('/project/:projectId/:workSpaceId', authenticateUser, autherizer.has(['delete_project']), projectControllerInterface.deleteProject);
userRouter.route('/project')
    .post(validateBody(projectCreationSchema), authenticateUser, autherizer.has(['create_project']), planPolicyMiddleware.checkPolicy('createProject'), projectControllerInterface.createProject)
    .put(authenticateUser, autherizer.has(['edit_project']), projectControllerInterface.updateProject)
    .get(authenticateUser, projectControllerInterface.retrieveProject);

userRouter.route('/workspace')
    .get(authenticateUser, workspaceInterface.getWorkspace)
    .post(authenticateUser, autherizer.has(['create_workspace']), validateBody(createWorkspaceSchema), planPolicyMiddleware.checkPolicy('createWorkspace'), workspaceInterface.createWorkspace)

userRouter.put('/profile', authenticateUser, upload.any(), userControllerInterface.updateProfile);
userRouter.get('/dashboard/:projectId', authenticateUser, projectControllerInterface.projectStats);

userRouter.route('/member')
    .post(authenticateUser,
        autherizer.has(['invite_user']),
        validateBody(addMemberSchema),
        planPolicyMiddleware.checkPolicy('maxMembers'),
        projectControllerInterface.addMember)
    .patch(authenticateUser, autherizer.has(['remove_user']), projectControllerInterface.removeMember);

userRouter.route('/epic')
    .post(authenticateUser, autherizer.has(['create_epic']), validateBody(createEpicSchema), backlogControllerInterface.createEpic)
    .put(authenticateUser, autherizer.hasAny(['edit_epic', 'create_epic']), validateBody(updateEpicSchema), backlogControllerInterface.updateEpic);

userRouter.route('/issue')
    .post(authenticateUser, autherizer.has(['create_task']), validateBody(createIssueSchema), backlogControllerInterface.createIssue)
    .patch(authenticateUser, autherizer.has(['assign_task']), issue.canMutate('task'), validateBody(assignIssueSchema), backlogControllerInterface.assignIssue)

userRouter.post('/subtask', authenticateUser, autherizer.has(['create_task']), issue.canMutate('task'), validateBody(createSubtaskSchema), backlogControllerInterface.createSubtask);
userRouter.delete('/task/:taskId', authenticateUser, autherizer.has(['delete_task']), issue.canMutate('task'), backlogControllerInterface.removeTask);

userRouter.route('/sprints')
    .post(authenticateUser, autherizer.has(['create_sprint']), validateBody(createSprintSchema), backlogControllerInterface.createSprint)
    .put(authenticateUser, autherizer.has(['start_sprint']), validateBody(startSprintSchema), backlogControllerInterface.startSprint);
userRouter.put('/complete-sprint', authenticateUser, autherizer.has(['close_sprint']), issue.canMutate('sprint'), validateBody(completeSprintSchema), backlogControllerInterface.completeSprint);
userRouter.get('/completed-sprints', authenticateUser, autherizer.hasAny(['view_all_task', 'view_task', 'view_sprint']), backlogControllerInterface.getCompletedSprintDetails);
userRouter.get('/tasks/sprint/:sprintId', authenticateUser, autherizer.has(['view_all_task']), backlogControllerInterface.getTasksInSprint);

userRouter.get('/sprints/:projectId', authenticateUser, autherizer.has(['view_sprint']), backlogControllerInterface.getSprints);
userRouter.get('/sprints/kanban/:projectId', authenticateUser,
    autherizer.hasAny(['view_sprint', 'view_task', 'view_all_task', 'close_sprint', 'edit_task', 'comment_task']), backlogControllerInterface.getSprints);

userRouter.route('/comments')
    .get(authenticateUser, autherizer.hasAny(['view_task', 'view_all_task', 'comment_task']), backlogControllerInterface.getComments)
    .post(authenticateUser, autherizer.has(['comment_task']), backlogControllerInterface.addComment);
userRouter.get('/tasks', authenticateUser, autherizer.hasAny(['view_task', 'view_all_task', 'view_sprint']), backlogControllerInterface.getTasks);
userRouter.get('/tasks/kanban', authenticateUser, autherizer.hasAny(['view_task', 'view_all_task', 'view_sprint']), backlogControllerInterface.getTasks);
userRouter.get('/task-history', authenticateUser, autherizer.hasAny(['view_task', 'view_all_task']), backlogControllerInterface.taskHistory);
userRouter.patch('/control-user', authenticateUser, autherizer.has(['assign_role']), validateBody(controlSchema), teamInterface.updateUserRole);

userRouter.put('/story-points', authenticateUser, autherizer.has(['set_storyPoint']), issue.canMutate('task'), validateBody(storyPointSchema), backlogControllerInterface.setStoryPoint)

userRouter.get('/get-users', authenticateUser, autherizer.has(['assign_role']), teamInterface.getCompanyUsers);
userRouter.get('/team', authenticateUser, teamInterface.getTeam);
userRouter.put('/update-task', authenticateUser, autherizer.has(['edit_task']), validateBody(dragDropSchema), backlogControllerInterface.dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateUser, autherizer.has(['edit_task']), validateBody(taskStatusUpdateSchema), backlogControllerInterface.changeTaskStatus);
userRouter.put('/update-task-details', authenticateUser, autherizer.has(['edit_task']), upload.any(), backlogControllerInterface.updateTaskDetails);
userRouter.delete('/delete-attachment', authenticateUser, autherizer.has(['edit_task']), backlogControllerInterface.deleteCloudinaryAttachment);


userRouter.post('/start-conversation', authenticateUser, validateBody(startConversationSchema), chatControllerInterface.startConversation);
userRouter.get('/get-chats', authenticateUser, chatControllerInterface.getChats);
userRouter.get('/get-messages/:convoId', authenticateUser, chatControllerInterface.getMessages);
userRouter.post('/send-message', authenticateUser, validateBody(sendMessageSchema), chatControllerInterface.sendMessage);
userRouter.get('/activity', authenticateUser, getActivitiesInterface.getActivity);

userRouter.get('/get-zegotoken', authenticateUser, groupCallInterface.getCallToken);
userRouter.post('/create-room', authenticateUser, autherizer.has(['create_room']), validateBody(meetingSchema), groupCallInterface.createRoom);
userRouter.get('/get-upcoming-meetings', authenticateUser, groupCallInterface.getUpcomingMeetings);
userRouter.delete('/remove-meeting', authenticateUser, autherizer.has(['remove_room']), groupCallInterface.removeMeeting);

export default userRouter;