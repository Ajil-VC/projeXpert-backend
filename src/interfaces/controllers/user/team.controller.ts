import { Request, Response } from "express";
import { TeamRepositoryImp } from "../../../infrastructure/repositories/team.repositoryImp";
import { GetTeamMembers } from "../../../application/usecase/teamManagement/getTeam.usecase";


const teamRepositoryOb = new TeamRepositoryImp();
const getTeamMemberUsecaseOb = new GetTeamMembers(teamRepositoryOb);

export const getTeam = async (req: Request, res: Response): Promise<void> => {

    try {

        const projectId = req.query.projectId;
        if (typeof projectId !== 'string') throw new Error('Project Id is not valid string.');
        
        const result = await getTeamMemberUsecaseOb.execute(projectId);
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