import { IDecodeToken } from "../../domain/services/decodeToken.interface";


export class DecodeTokenImp implements IDecodeToken {

    decode(token: string): Promise<any> {

        const payLoad = token.split('.')[1];
        const decodedPayload = atob(payLoad);
        return JSON.parse(decodedPayload);

    }

}
