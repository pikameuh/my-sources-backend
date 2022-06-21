import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/common/users/users.controller';
import { AuthModule } from '../auth/auth.module';
import { DateManagerModule } from '../managers/date-manager/date-manager.module';
import { MailModule } from '../mail/mail.module';
import usersConfig from './config/users.config';
import { DateManager } from './entities/date-manager.entity';
import { Role } from './entities/role.entity';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TokenManagerModule } from '../managers/token/token-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Token, DateManager]), 
    ConfigModule.forFeature(usersConfig),
    MailModule,
    DateManagerModule,
    TokenManagerModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController], 
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}