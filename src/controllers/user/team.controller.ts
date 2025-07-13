import { NextFunction, Request, Response } from "express";
import { getTeammembersUsecase } from "../../config/Dependency/user/team.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { ITeamController } from "../../interfaces/user/team.controller.interface";
import { GetTeamMembers } from "../../application/usecase/teamManagement/getTeam.usecase";


export class TeamController implements ITeamController {

    private getTeammembersUsecase: GetTeamMembers;
    constructor() {

        this.getTeammembersUsecase = getTeammembersUsecase;
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
