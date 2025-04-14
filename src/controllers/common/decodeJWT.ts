
export function decodeToken(token : string): any{

    const payLoad = token.split('.')[1];
    const decodedPayload = atob(payLoad);
    return JSON.parse(decodedPayload);
    
}