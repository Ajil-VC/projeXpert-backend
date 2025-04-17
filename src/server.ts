
import express from 'express';
import connectDB from './config/connectDB';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/config';
import userRouter from './interfaces/routes/userRoutes';
import companyRouter from './interfaces/routes/companyRoutes';


const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}))
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/api/v1/company', companyRouter);
app.use('/api/v1/user', userRouter);
// app.use('/api/v1/admin',adminRouter);

app.listen(config.PORT, () => {
    console.log(`Hmmm, ProjeXpert is listening at http://localhost:${config.PORT}`);
})