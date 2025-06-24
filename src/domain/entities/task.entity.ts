

export class TaskEntityDetailed {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly type: "task" | "epic" | "story" | "subtask" | "bug",
        public readonly status: "in-progress" | "todo" | "done",
        public readonly priority: 'low' | 'medium' | 'high' | 'critical',
        public readonly assignedTo: {
            _id: string,
            name: string,
            email: string,
            profilePicUrl: string,
            role: string,
            createdAt: string,
            updatedAt: string
        } | null,
        public readonly projectId: string,
        public readonly epicId?: string,
        public readonly sprintId?: string,
        public readonly sprintNumber?: number,
        public readonly parentId?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}