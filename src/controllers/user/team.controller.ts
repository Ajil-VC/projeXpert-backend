import { NextFunction, Request, Response } from "express";
import { getCompanyUsersUsecase, getTeammembersUsecase, restrictUserUsecase } from "../../config/Dependency/user/team.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { ITeamController } from "../../interfaces/user/team.controller.interface";
import { GetTeamMembers } from "../../application/usecase/teamManagement/getTeam.usecase";
import { GetUsersInCompany } from "../../application/usecase/teamManagement/getusers.usecase";
import { RestrictUser } from "../../application/usecase/teamManagement/restrictUser.usecase";


export class TeamController implements ITeamController {

    private getTeammembersUsecase: GetTeamMembers;
    private getCompanyUsersUsecase: GetUsersInCompany;
    private restrictUserUsecase: RestrictUser;

    constructor() {

        this.getTeammembersUsecase = getTeammembersUsecase;
        this.getCompanyUsersUsecase = getCompanyUsersUsecase;
        this.restrictUserUsecase = restrictUserUsecase;
    }


    restrictUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const userId = req.body.userId;

            let status!: boolean | null;
            if (req.body.status === 'true') { status = true }
            else if (req.body.status === 'false') { status = false }
            else { status = null }

            const userRole = req.body.userRole;

            if (userId === req.user.id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'Self status changing is not possible.' });
                return;
            }

            const result = await this.restrictUserUsecase.execute(userId, status, userRole);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }

    getCompanyUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.getCompanyUsersUsecase.execute(req.user.companyId);
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
