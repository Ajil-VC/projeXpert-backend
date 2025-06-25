



import dotenv from 'dotenv';
dotenv.config();

export const config = {

    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    FROM_EMAIL: process.env.FROM_EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD,
    JWT_SECRETKEY: process.env.JWT_SECRETKEY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'falbackValueForRefreshToken',
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET

}
