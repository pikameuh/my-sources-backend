import { forwardRef, Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { UsersModule } from 'src/common/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/common/auth/auth.module';
import { MailModule } from 'src/common/mail/mail.module';
import { DateManagerModule } from 'src/common/managers/date-manager/date-manager.module';
import { TokenManagerModule } from 'src/common/managers/token/token-manager.module';
import usersConfig from 'src/common/users/config/users.config';

@Module({
  imports: [
    UsersModule,
    // TypeOrmModule.forFeature([User, Role, Token, DateManager]), 
    ConfigModule.forFeature(usersConfig),
    MailModule,
    DateManagerModule,
    TokenManagerModule,
    forwardRef(() => AuthModule)
  ],
  providers: [SourcesService],
  controllers: [SourcesController],
  exports: [SourcesModule],
})
export class SourcesModule {}



// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User, Role, Token, DateManager]), 
//     ConfigModule.forFeature(usersConfig),
//     MailModule,
//     DateManagerModule,
//     TokenManagerModule,
//     forwardRef(() => AuthModule),
//   ],
//   controllers: [UsersController], 
//   providers: [UsersService],
//   exports: [UsersService],
// })
// export class UsersModule {}
