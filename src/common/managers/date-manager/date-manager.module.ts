import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/common/users/users.controller';
import { AuthModule } from '../../auth/auth.module';
import { MailModule } from '../../mail/mail.module';
import usersConfig from '../../users/config/users.config';
import { DateManager } from '../../users/entities/date-manager.entity';
import { User } from '../../users/entities/user.entity';
import { DateManagerService } from './date-manager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DateManager]), 
    ConfigModule.forFeature(usersConfig),
    MailModule,
    // forwardRef(() => AuthModule),
  ],
  // controllers: [UsersController], 
  providers: [DateManagerService],
  exports: [DateManagerService],
})
export class DateManagerModule {}