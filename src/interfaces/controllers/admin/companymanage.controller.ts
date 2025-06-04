import { Request, Response } from "express";
import { changeUserStatusUseCase } from "../../../application/usecase/admin/updateUserStatus.usecase";
import { userRepositoryImp } from "../../../infrastructure/repositories/user.repositoryImp";


const userRepoImpOb = new userRepositoryImp();
const changeUserStatusUsecaseOb = new changeUserStatusUseCase(userRepoImpOb);

export const changeUserStatus = async (req: Request, res: Response) => {

    try {

        const { userId, status } = req.body;

        const result = await changeUserStatusUsecaseOb.execute(userId, status);
        if(!result){
            throw new Error('Couldnt update status.');
        }

        res.status(200).json({status: true, message : 'User status updated.'});
        return;

    } catch (err) {

        console.error(`Error occured while trying to change user status. ${err}`);
        res.status(500).json({ status: false, message: 'Error occured while trying to change user status.' });

    }
}