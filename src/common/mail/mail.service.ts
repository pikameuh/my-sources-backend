import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { Mails } from '../enums/mails.enum';
// import { User } from '../../src/auth/entities/user.entity';

@Injectable()
export class MailService {
    

    constructor(private mailerService: MailerService) {}

    confirmation_url = 'http://localhost:3000/users/confirmation';

    async sendUserConfirmation(user: User, token: string) {
        
        const url = `${this.confirmation_url}?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: Mails.SUBSCRIPTION_WELCOME_SUBJECT,
            template: '/confirmation', 
            context: { 
                name: user.username,
                url,
            },
        });
    }

    async reSendUserConfirmation(user: User, register_token: string) {
        const url = `${this.confirmation_url}?token=${register_token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: Mails.SUBSCRIPTION_WELCOME_AGAIN_SUBJECT,
            template: '/resend-confirmation', 
            context: { 
                name: user.username,
                url,
            },
        });
    }
}
