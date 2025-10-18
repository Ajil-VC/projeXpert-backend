export interface AppError extends Error {
    status?: number;
    code?: number | string;
    stack?: string;
}