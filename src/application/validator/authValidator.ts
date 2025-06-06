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