import { NextFunction, Request, Response } from "express";
import { IGetCompanyUsers, IGetTeamMembers, IUpdateUserRoleAndStatus } from "../../config/Dependency/user/team.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { ITeamController } from "../../interfaces/user/team.controller.interface";


export class TeamController implements ITeamController {


    constructor(
        private getTeammembersUsecase: IGetTeamMembers,
        private getCompanyUsersUsecase: IGetCompanyUsers,
        private updateUserRoleUsecase: IUpdateUserRoleAndStatus
    ) { }


    updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const userId = req.body.userId;
            const status = req.body.blockedStatus;
            const userRole = req.body.userRole;

            if (userId === req.user.id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Self status changing is not possible.' });
                return;
            }

            const result = await this.updateUserRoleUsecase.execute(userId, userRole, status);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    getCompanyUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const pageNum = req.query.page ? Number(req.query.page) : null;
            const limit = 2;
            const skip = pageNum ? (pageNum - 1) * limit : 0;

            const searchTerm = req.query.searchTerm ?? '';
            const role = req.query.role ?? '';
            let status: boolean | null = null;
            if (req.query.status) {
                status = req.query.status === 'active' ? false : true;
            }

            const result = await this.getCompanyUsersUsecase.execute(
                req.user.companyId,
                pageNum,
                limit,
                skip,
                req.user.id,
                searchTerm as string,
                role as string,
                status);

            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    getTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const rawProjectId = (req.query.projectId as string)?.trim();
            const projectId = rawProjectId === 'null' || rawProjectId === undefined ? null : rawProjectId;

            const result = await this.getTeammembersUsecase.execute(projectId, req.user.id);
            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'No team members found' });
                return;
            }
            res.status(HttpStatusCode.OK).json({ status: true, message: 'Team members fetched successfully', data: result });
            return;

        } catch (err) {

            next(err);
        }

    }
}
