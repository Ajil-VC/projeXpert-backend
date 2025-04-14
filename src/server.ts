
import express from 'express';
import connectDB from './config/db';
import {config} from './config/config';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';

const app = express();      

app.use(cors({
    origin : 'http://localhost:4200',
    credentials: true
}))
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/v1/user',userRouter);
// app.use('/api/v1/admin',adminRouter);

app.listen(config.PORT,()=>{
    console.log(`ProjeXpert is listening at http://localhost:${config.PORT}`);
})