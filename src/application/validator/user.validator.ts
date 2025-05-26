import * as yup from 'yup';

export const projectCreationSchema = yup.object({

    projectName: yup.string().required('Email is required'),
    workSpace: yup.string().required('Password is required'),
    priority: yup.string()

});

export const createEpicSchema = yup.object({
    epicName: yup.string().required('Epic name is required'),
    projectId: yup.string().required('projectId is required')
});

export const createIssueSchema = yup.object({
    projectId: yup.string().required('Project Id is required'),
    issueType: yup.string().required('Issue type is required'),
    issueName: yup.string().required('Issue name is required'),
    taskGroup: yup.string().required('Task group is required')
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
})