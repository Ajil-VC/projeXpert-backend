import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interfaces/user/user.controller.interface";
import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IGetRoleWithId, ICreateRole, IDeleteRole, IGetRoles, IUpdateProfile, IUpdateRole } from "../../config/Dependency/user/user.di";






export class userController implements IUserController {

    constructor(
        private updateProfilePic: IUpdateProfile,
        private createRoleUse: ICreateRole,
        private getRolesUse: IGetRoles,
        private getRoleWithId: IGetRoleWithId,
        private deleteRoleUse: IDeleteRole,
        private updateRole: IUpdateRole
    ) { }


    updateRoleData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const roleName = req.body.formData.roleName;
            const permissions = req.body.formData.permissions;
            const description = req.body.formData.description;
            const roleId = req.body.roleId;

            const role = await this.getRoleWithId.execute(roleId);
            if (!role.canMutate) {
                res.status(HttpStatusCode.CONFLICT).json({ status: false, message: "This role cannot be edited." });
                return;
            }

            const result = await this.updateRole.execute(roleName, permissions, description, roleId);
            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt update the role.' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: 'The role has been udpated successfully.', result, updated: true });
            return;

        } catch (err) {
            next(err);
        }
    }


    deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const roleId = req.query.roleId;
            if (typeof roleId !== 'string') {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Role Id should be a strig.' });
                return;
            }

            const role = await this.getRoleWithId.execute(roleId);
            if (!role.canMutate) {
                res.status(HttpStatusCode.CONFLICT).json({ status: false, message: "This role cannot be deleted." });
                return;
            }

            const result = await this.deleteRoleUse.execute(roleId);
            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: "Role couldnt delete." });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: `Role ${role.name} is deleted.` });
            return;

        } catch (err) {
            next(err);
        }
    }


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

        } catch (err: any) {

            if (err.code === 11000) {
                res.status(HttpStatusCode.CONFLICT).json({ status: false, message: "Cannot create roles with same name." });
                return;
            }
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





