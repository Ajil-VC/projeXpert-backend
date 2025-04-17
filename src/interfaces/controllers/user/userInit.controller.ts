import { Request, Response } from "express";
import { InitDashBoardUseCase } from "../../../application/usecase/workspaceUsecase/initDashboard.usecase";
import { DecodeTokenImp } from "../../../infrastructure/services/decodeToken.serviceImp";
import { userRepositoryImp } from "../../../infrastructure/repositories/user.repositoryImp";


const decodeTokenOb = new DecodeTokenImp();
const userRepoOb = new userRepositoryImp();
const initDashBoardUseCaseOb = new InitDashBoardUseCase(decodeTokenOb, userRepoOb);

export const getInitData = async (req: Request, res: Response) => {

    try {

        if (!req.headers.authorization) {
            res.status(401).json({ error: 'Authorization header is missing' });
            return;
        }
        const userData = await initDashBoardUseCaseOb.execute(req.headers.authorization)

        if (userData) {

            res.status(200).json({
                status: true,
                user: {
                    name: userData.name,
                    profileUrl: userData.profilePicUrl,
                    email: userData.email,

                    role: userData.role,
                    workSpaces: userData.workspaceIds
                }
            });
            
        }

    } catch (err) {
        console.error(`Error occured while trying to get init data. ${err}`);
    }

}