import nodemailer from 'nodemailer';
import { config } from '../../config/config';
import { IEmailService } from '../../domain/services/email.interface';

export class EmailServiceImp implements IEmailService {

    async send(to: string, subject: string, txt: string): Promise<boolean> {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.FROM_EMAIL,
                pass: config.APP_PASSWORD
            }
        });
        await transporter.sendMail({
            from: config.FROM_EMAIL,
            to: to,
            subject: subject,
            text: txt
        })

        return true;
    }

}
