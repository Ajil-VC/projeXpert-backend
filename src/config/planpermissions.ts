

export const PLAN_PERMISSIONS = {

    Free: {
        createWorkspace: { limit: 1 },
        createProject: { limit: 1 },
    },
    Pro: {
        createWorkspace: { limit: 2 },
        createProject: { limit: 4 },
    },
    Enterprise: {
        createWorkspace: { limit: Infinity },
        createProject: { limit: Infinity },
    },

};
