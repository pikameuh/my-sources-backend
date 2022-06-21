import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Color } from 'src/common/enums/colors.enum';
import { LogC } from 'src/common/utils/logc';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private moduleRef: ModuleRef) {
        super({
            passReqToCallback: true,
        });
    }

    async validate(request: Request, username: string, password: string): Promise<any> {
        LogC.log(`+ LocalStrategy.validate( ${request})`, Color.FgYellow );
        const contextId = ContextIdFactory.getByRequest(request);
        // "AuthService" is a request-scoped provider
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        const user = await authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}