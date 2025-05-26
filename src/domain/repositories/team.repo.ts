

export interface ITeamRepository {

    getTeamMembers(projectId: string): Promise<Array<any>>;

}