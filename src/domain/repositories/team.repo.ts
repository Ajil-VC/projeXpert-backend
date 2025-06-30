

export interface ITeamRepository {

    getTeamMembers(projectId: string | null, userId: string): Promise<Array<any>>;

}