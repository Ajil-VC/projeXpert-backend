import * as yup from 'yup';

export const companyRegisterSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required')
})

export const otpValidationSchema = yup.object({
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),

    otp: yup.string()
        .length(5, 'OTP must be 5 characters long')
        .matches(/^\d+$/, "OTP must be numeric")
        .required('OTP is required')
})

export const registerSchema = yup.object({
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),

    companyName: yup.string().required('Name is required'),

    passWord: yup.string().required('Password is required')
})

export const signinSchema = yup.object({

    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    passWord: yup.string().required('Password is required')

})

export const passWordChangeSchema = yup.object({

    passWord: yup.string()
        .required('Password is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain uppercase, lowercase, number,and special charecter")
});

export const changeUserStatusSchema = yup.object({
    userId: yup.string().required('UserId required.'),
    status: yup.boolean().required('status required')
});

export const changeCompanyStatusSchema = yup.object({
    companyId: yup.string().required('companyId required.'),
    status: yup.string().required('status required.'),
});

export const createPlanSchema = yup.object({
    name: yup.string().required('Plan name is required'),
    price: yup.number().required('Price is required'),
    billingCycle: yup
        .string()
        .oneOf(['month', 'year'], 'Billing cycle must be either "month" or "year"')
        .required('Billing cycle is required'),
    maxWorkspace: yup.number().required('Maximum workspace required'),
    maxProjects: yup.number().required('Maximum Projects required'),
    maxMembers: yup.number().required('Maximum members required'),
    canUseVideoCall: yup.string().oneOf(['true', 'false'], 'Video call ability option should be true or false').required('Videocall ability required'),
    description: yup.string().required('Description required')
});