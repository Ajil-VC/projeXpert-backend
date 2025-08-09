import { IGenerateKitToken } from "../../domain/services/generateKitToken.interface";
import * as crypto from 'crypto';


export class GenerateKitTokenService implements IGenerateKitToken {

    constructor() { }

    generateKitTokenForRoom(appId:number, userId:string, serverSecret:string, effectiveTimeInSeconds:number = 3600, payload = '') {
        const createTime = Math.floor(Date.now() / 1000);
        const tokenInfo = {
            app_id: appId,
            user_id: userId,
            nonce: Math.floor(Math.random() * 2147483647),
            ctime: createTime,
            expire: createTime + effectiveTimeInSeconds,
            payload: payload
        };

        // Create signature
        const body = JSON.stringify(tokenInfo);
        const signature = crypto
            .createHmac('sha256', serverSecret)
            .update(body)
            .digest('base64');

        // Create final token
        const token = {
            ...tokenInfo,
            signature: signature
        };

        // Encode to base64
        return Buffer.from(JSON.stringify(token)).toString('base64');
    }
}