import * as yup from 'yup';

export const projectCreationSchema = yup.object({

    projectName: yup.string().required('Email is required'),
    workSpace: yup.string().required('Password is required'),
    priority: yup.string()

});

export const createEpicSchema = yup.object({
    epicName: yup.string().required('Epic name is required'),
    projectId: yup.string().required('projectId is required')
})