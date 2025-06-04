
import express from 'express';
import connectDB from './config/connectDB';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/config';
import userRouter from './interfaces/routes/userRoutes';
import companyRouter from './interfaces/routes/companyRoutes';
import { setupSocket } from './config/socket'; 
import cookieParser from 'cookie-parser';


import http from 'http';
import adminRouter from './interfaces/routes/adminRoutes';

const app = express();

app.use(cookieParser());
//This section is settin socket.
const server = http.createServer(app);
setupSocket(server);

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/v1/company', companyRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin',adminRouter);

server.listen(config.PORT, () => {
    console.log(`Hmmm, ProjeXpert is listening at http://localhost:${config.PORT}`);
})