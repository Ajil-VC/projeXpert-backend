

import express from 'express';
import connectDB from './config/connectDB';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/config';
import userRouter from './routes/userRoutes';
import companyRouter from './routes/companyRoutes';
import { setupSocket } from './config/socket';
import cookieParser from 'cookie-parser';

import fs from 'fs';
import path from 'path';
import logger from './utils/logger';

import http from 'http';
import adminRouter from './routes/adminRoutes';
import webhookRouter from './routes/webhookRoutes';

const app = express();

app.use('/api/v1/webhook', webhookRouter);

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Create a write stream for morgan (access log)
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

// Log all requests using morgan and write to access.log
app.use(morgan('combined', { stream: accessLogStream }));

//logs in console.
app.use(morgan('dev'));

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
app.use('/api/v1/admin', adminRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
        stack: err.stack,
        status: err.status || 500,
    });
    res.status(500).json({ message: 'Something went wrong' });
});

server.listen(config.PORT, () => {
    console.log(`Hmmm, ProjeXpert is listening at http://localhost:${config.PORT}`);
})