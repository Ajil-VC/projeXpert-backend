import * as yup from 'yup';

export const projectCreationSchema = yup.object({

    projectName: yup.string().required('Email is required'),
    workSpace: yup.string().required('Password is required'),
    priority: yup.string()

})