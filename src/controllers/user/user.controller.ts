import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interfaces/user/user.controller.interface";
import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { ICreateRole, IGetRoles, IUpdateProfile } from "../../config/Dependency/user/user.di";






export class userController implements IUserController {

    constructor(
        private updateProfilePic: IUpdateProfile,
        private createRoleUse: ICreateRole,
        private getRolesUse: IGetRoles
    ) { }


    getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const roles = await this.getRolesUse.execute(req.user.companyId);
            res.status(HttpStatusCode.OK).json({ status: true, result: roles });
            return;

        } catch (err) {
            next(err);
        }
    }


    createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { roleName, permissions, description } = req.body;
            const result = await this.createRoleUse.execute(roleName, permissions, description, req.user.companyId);
            res.status(HttpStatusCode.CREATED).json({ status: true, message: 'Added new role.', result });
            return;

        } catch (err) {
            next(err)
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const name = req.body.name;
            const files = req.files as Express.Multer.File[] || [];

            const file = files[0];
            const result = await this.updateProfilePic.execute(file, req.user.id, name);

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.COMMON.SUCCESS, result });
            return;

        } catch (err) {

            next(err);
        }
    }
}





