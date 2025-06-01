



import dotenv from 'dotenv';
dotenv.config();

export const config = {

    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    FROM_EMAIL: process.env.FROM_EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD,
    JWT_SECRETKEY: process.env.JWT_SECRETKEY,
    FRONTEND_URL: process.env.FRONTEND_URL

}
