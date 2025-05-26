


export class GetSprintsUseCase{
    
    constructor(private backlogRepository: any) {}

    async execute(projectId: string): Promise<any> {

        const result = await this.backlogRepository.getSprints(projectId);
        if (!result) throw new Error('Error while getting sprints');
        return result;
    }
}