import * as yup from 'yup';

export const projectCreationSchema = yup.object({

    projectName: yup.string().required('Email is required'),
    workSpace: yup.string().required('Password is required'),
    priority: yup.string()

});

export const addMemberSchema = yup.object({
    email: yup.string().required('Email required.'),
    projectId: yup.string().required('Project Id required.'),
    workSpaceId: yup.string().required('Workspace Id required.'),
    roleId: yup.string().required('Role Id required.').nullable()
})

export const createEpicSchema = yup.object({
    title: yup.string().required('Epic name is required'),
    description: yup.string(),
    startDate: yup.string().required('Start date is required'),
    endDate: yup.string().required('End Date is required'),
    projectId: yup.string().required('projectId is required')
});

export const updateEpicSchema = yup.object({
    title: yup.string().required('Epic name is required'),
    description: yup.string(),
    startDate: yup.string().required('Start date is required'),
    endDate: yup.string().required('End Date is required'),
    status: yup.string(),
    epicId: yup.string().required('EpicId is required')
});


export const createIssueSchema = yup.object({
    projectId: yup.string().required('Project Id is required'),
    issueType: yup.string().required('Issue type is required'),
    issueName: yup.string().required('Issue name is required'),
    taskGroup: yup.string().required('Task group is required')
});

export const createSubtaskSchema = yup.object({
    title: yup.string().required('Title needed'),
    parentId: yup.string().required('Parent Id Needed.')
});

export const assignIssueSchema = yup.object({
    issueId: yup.string().required('Issue Id is required')
});

export const createSprintSchema = yup.object({
    projectId: yup.string().required('Project Id is required'),
    issueIds: yup.array().of(yup.string()).required('Issue Ids are required')
        .min(1, 'At least one issue Id is required')
});

export const dragDropSchema = yup.object({
    prevContainerId: yup.string().required('prevContainerId required'),
    containerId: yup.string().required('Container id required'),
    movedTaskId: yup.string().required('Moved task id required'),
});

export const taskStatusUpdateSchema = yup.object({
    taskId: yup.string().required('task id required'),
    status: yup.string().required('status required')
});

export const startSprintSchema = yup.object({
    sprintId: yup.string().required('Sprint id required'),
    sprintName: yup.string().required('Sprint name required'),
    duration: yup.number().required('duration required'),
    startDate: yup.date().required('Date required'),
    projectId: yup.string().required('projectId required'),
    goal: yup.string().required('Sprint goal is required'),
    description: yup.string()
});

export const completeSprintSchema = yup.object({
    completingSprintId: yup.string().required('Completing sprint id required'),
    projectId: yup.string().required('project id required.')
})

export const createWorkspaceSchema = yup.object({
    workspaceName: yup.string().required('workspaceName is required')
});


export const startConversationSchema = yup.object({
    userId: yup.string().required('User Id is required')
});

export const sendMessageSchema = yup.object({
    convoId: yup.string().required('Conversation id required'),
    recieverId: yup.string().required('Reciever Id required'),
    message: yup.string().required('Message required')
});


export const controlSchema = yup.object({
    userId: yup.string().required('User Id required'),
    status: yup.string().nullable(),
    userRole: yup.string(),
    blockedStatus: yup.boolean().nullable()
});

export const storyPointSchema = yup.object({
    storyPoints: yup
        .number()
        .oneOf([0, 1, 2, 3, 5, 8, 13, 21], 'Point must be a valid Fibonacci number')
        .required('Story point required'),
    taskId: yup.string().required('Task Id required.')
});

export const meetingSchema = yup.object({
    roomName: yup
        .string()
        .trim()
        .required('Room name is required'),

    recurring: yup.boolean().required(),
    meetingDate: yup.string().when('recurring', {
        is: false,
        then: schema =>
            schema
                .required('Meeting date is required')
                .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        otherwise: schema => schema.notRequired()
    }),

    meetingTime: yup
        .string()
        .required('Meeting time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm in 24-hour format)'),

    description: yup
        .string()
        .optional(),

    members: yup
        .array()
        .of(
            yup
                .string()
                .trim()
                .required('Member ID must be a non-empty string')
        )
        .min(1, 'At least one member is required'),

    roomId: yup.string().required('Room Id is required'),
    url: yup.string().required('url is required')
});


export const roleSchema = yup.object({
    roleName: yup.string().trim().required('Role name required.'),
    permissions: yup.array().of(
        yup.string().trim().required('Permissions required.')
    ).min(1, 'Atleast 1 permission needed.'),
    description: yup.string().optional()
});

export const roleEditSchema = yup.object({
    formData: yup.object({
        roleName: yup
            .string()
            .trim()
            .required("Role name is required")
            .min(3, "Role name must be at least 3 characters"),
        permissions: yup
            .array()
            .of(yup.string().required())
            .min(1, "At least one permission is required"),
        description: yup
            .string()
            .trim()
            .optional()
    }),
    roleId: yup
        .string()
        .required("Role ID is required")
        .matches(/^[0-9a-fA-F]{24}$/, "Role ID must be a valid ObjectId")
});