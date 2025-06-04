

export interface ITeamRepository {

    getTeamMembers(projectId: string, userId: string): Promise<Array<any>>;

}