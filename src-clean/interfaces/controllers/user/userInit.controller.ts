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

            console.log(userData)
            // const currentWorkSpace = userData.workspaceIds.find(ele => ele?.isDefault)

            res.status(201).json({
                status: true,
                user: {
                    name: userData.name,
                    profileUrl: userData.profilePicUrl,
                    email: userData.email,
                    plan: userData.plan,
                    role: userData.role,
                    workSpaces: userData.workspaceIds
                }
            });
            // res.status(201).json({
                //         status: true,
                //         token: registeredData.token,
                //         user: {
                //             name: registeredData.data.user.name,
                //             profileUrl: registeredData.data.user.profilePicUrl,
                //             email: registeredData.data.user.email,
                //             plan: registeredData.data.user.plan,
                //             role: registeredData.data.user.role,
                //             workSpaces: registeredData.data.user.workspaceIds
                //         },
                //         workSpace: {
                //             name: registeredData.data.workspace.name,
                //             owner: registeredData.data.workspace.owner,
                //             isDefault: registeredData.data.workspace.isDefault,
                //             members: registeredData.data.workspace.members
                //         }
                //     });
        }

    } catch (err) {
        console.error(`Error occured while trying to get init data. ${err}`);
    }

}