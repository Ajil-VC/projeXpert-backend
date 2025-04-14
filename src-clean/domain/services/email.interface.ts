

export interface IEmailService {

    send(to: string, subject: string, txt: string): Promise<boolean>;
}