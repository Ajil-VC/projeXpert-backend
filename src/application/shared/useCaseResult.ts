
export interface useCaseResult {
    status: boolean;
    message: string;
    statusCode?: number;
    token?: string;
    additional?: any;
}