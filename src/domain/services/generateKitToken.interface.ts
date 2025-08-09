

export interface IGenerateKitToken {

    generateKitTokenForRoom(appId: number, userId: string, serverSecret: string, effectiveTimeInSeconds: number, payload: string): string;
}