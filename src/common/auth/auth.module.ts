import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesGuard } from './strategies/roles.guards';

@Module({
  imports: [
    forwardRef(() =>UsersModule), 
    PassportModule, 
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.SECRET,
        signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME },
      })
    }),
    
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule { }
