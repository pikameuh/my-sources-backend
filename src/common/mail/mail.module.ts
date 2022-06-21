import { MailerModule } from '@nestjs-modules/mailer'; 
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

// @Global()
@Module({
    imports: [
      MailerModule.forRootAsync({
          useFactory: async () => ({
            transport: {
                host: process.env.MAIL_HOST,
                secure: false,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: `"No Reply" <${process.env.MAIL_FROM}>`,
            },
            template: {
                dir: join(__dirname, '../../../common/mail/templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                  strict: true,
                },
            },
          }),
        // inject: [ConfigService],
      }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
