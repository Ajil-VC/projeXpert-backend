
import express from 'express';
const adminRouter = express.Router();
adminRouter.use(express.urlencoded({extended: true}));

export default adminRouter;