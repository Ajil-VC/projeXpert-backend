import { Request, Response } from "express";
import { getTeammembersUsecase } from "../../../config/Dependency/user/team.di";

export const getTeam = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.query.projectId;

        if (typeof projectId !== 'string') throw new Error('Project Id is not valid string.');

        const result = await getTeammembersUsecase.execute(projectId, req.user.id);
        if (!result) {
            res.status(404).json({ status: false, message: 'No team members found' });
            return;
        }
        res.status(200).json({ status: true, message: 'Team members fetched successfully', data: result });
        return;

    } catch (err) {
        console.error('Internal server error while fetching team members', err);
        res.status(500).json({ status: false, message: 'Internal server error while fetching team members' });
        return;
    }

}