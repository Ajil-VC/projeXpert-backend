
import express from 'express';
import { validateBody } from '../infrastructure/middleware/validateBody';
import { passWordChangeSchema, signinSchema } from '../application/validator/authValidator';
import { authenticateAsAdmin, authenticateUser } from '../infrastructure/middleware/user.middleware';

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
} from '../application/validator/user.validator';

import { BacklogController } from '../controllers/user/backlog.controller';

import { upload } from '../infrastructure/middleware/multer.middleware';
import { ChatController } from '../controllers/user/chat.controller';
import { ProjectController } from '../controllers/user/project.controller';
import { UserInitController } from '../controllers/user/userInit.controller';
import { TeamController } from '../controllers/user/team.controller';
import { WorkSpaceController } from '../controllers/user/workspace.controller';
import { AuthController } from '../controllers/authController';

const userRouter = express.Router();
userRouter.use(express.urlencoded({ extended: true }));

const backlogController = new BacklogController();
const chatController = new ChatController();
const projectController = new ProjectController();
const teamController = new TeamController();
const userInitController = new UserInitController();
const workspaceController = new WorkSpaceController();
const authController = new AuthController();

userRouter.get('/authenticate-user', authenticateUser, authController.isVerified);
userRouter.post('/login', validateBody(signinSchema), authController.signIn);
userRouter.post('/change-password', validateBody(passWordChangeSchema), authenticateUser, authController.changePassword);
userRouter.post('/refresh-token', authController.refreshToken);

userRouter.get('/get-notifications', authenticateUser, userInitController.getNotifications);
userRouter.patch('/update-notificaions', authenticateUser, userInitController.updateNotification);

userRouter.get('/init-data', authenticateUser, userInitController.getInitData);
userRouter.get('/projects-initials', authenticateUser, projectController.getProjectsInitData);
userRouter.post('/create-project', validateBody(projectCreationSchema), authenticateAsAdmin, projectController.createProject);
userRouter.get('/init-projects', authenticateAsAdmin, projectController.getProjectData);
userRouter.get('/get-project', authenticateUser, projectController.getProject);
userRouter.post('/create-workspace', authenticateAsAdmin, validateBody(createWorkspaceSchema), workspaceController.createWorkspace);

userRouter.post('/add-member', authenticateAsAdmin, projectController.addMember);
userRouter.patch('/remove-member', authenticateAsAdmin, projectController.removeMember);
userRouter.put('/update-project', authenticateAsAdmin, projectController.updateProject);
userRouter.delete('/delete-project/:projectId/:workSpaceId', authenticateAsAdmin, projectController.deleteProject);

userRouter.post('/create-epic', authenticateAsAdmin, validateBody(createEpicSchema), backlogController.createEpic);
userRouter.put('/update-epic', authenticateAsAdmin, validateBody(updateEpicSchema), backlogController.updateEpic);
userRouter.post('/create-issue', authenticateAsAdmin, validateBody(createIssueSchema), backlogController.createIssue);
userRouter.post('/create-sprint', authenticateAsAdmin, validateBody(createSprintSchema), backlogController.createSprint);
userRouter.get('/get-sprints/:projectId', authenticateAsAdmin, backlogController.getSprints);
userRouter.get('/get-sprints/kanban/:projectId', authenticateUser, backlogController.getSprints);
userRouter.get('/tasks', authenticateUser, backlogController.getTasks);
userRouter.get('/tasks/kanban', authenticateUser, backlogController.getTasks);
userRouter.get('/get-comments', authenticateUser, backlogController.getComments);
userRouter.post('/add-comment', authenticateUser, backlogController.addComment);

userRouter.get('/team', authenticateUser, teamController.getTeam);
userRouter.patch('/assign-issue', authenticateAsAdmin, validateBody(assignIssueSchema), backlogController.assignIssue);
userRouter.put('/update-task', authenticateAsAdmin, validateBody(dragDropSchema), backlogController.dragDropUpdate);
userRouter.put('/change-taskstatus', authenticateUser, validateBody(taskStatusUpdateSchema), backlogController.changeTaskStatus);
userRouter.put('/update-task-details', authenticateUser, upload.any(), backlogController.updateTaskDetails);
userRouter.delete('/delete-attachment', authenticateUser, backlogController.deleteCloudinaryAttachment);

userRouter.put('/start-sprint', authenticateAsAdmin, validateBody(startSprintSchema), backlogController.startSprint);
userRouter.put('/complete-sprint', authenticateUser, validateBody(completeSprintSchema), backlogController.completeSprint);

userRouter.post('/start-conversation', authenticateUser, validateBody(startConversationSchema), chatController.startConversation);
userRouter.get('/get-chats/:projectId', authenticateUser, chatController.getChats);
userRouter.get('/get-messages/:convoId', authenticateUser, chatController.getMessages);
userRouter.post('/send-message', authenticateUser, validateBody(sendMessageSchema), chatController.sendMessage);

export default userRouter;