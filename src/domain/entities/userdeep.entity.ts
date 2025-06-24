

export class UserDeepEntityDetailed {
    constructor(


        public readonly _id: string,
        public readonly name: string,
        public readonly profilePicUrl: string,
        public readonly email: string,
        public readonly role: 'admin' | 'user',
        public readonly forceChangePassword: boolean,

        public readonly workspaceIds: {
            _id: string,
            name: string,
            members: [],
            companyId: string,
            projects: {
                _id: string,
                name: String,
                workSpace: string,
                companyId: string,
                members: string[],
                status: 'active' | 'archived' | 'completed',
                priority: 'low' | 'medium' | 'high' | 'critical',
                createdAt?: Date;
                updatedAt?: Date;
            }[],
            createdAt: Date,
            updatedAt: Date,
        }[],
        public readonly defaultWorkspace: {
            _id: string,
            name: string,
            members: [],
            companyId: string,
            projects: {
                _id: string,
                name: String,
                workSpace: string,
                companyId: string,
                members: string[],
                status: 'active' | 'archived' | 'completed',
                priority: 'low' | 'medium' | 'high' | 'critical',
                createdAt?: Date;
                updatedAt?: Date;
            }[],
            createdAt: Date,
            updatedAt: Date,
        }

    ) { }
}