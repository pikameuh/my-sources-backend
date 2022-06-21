import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Color } from 'src/common/enums/colors.enum';
import { LogC } from 'src/common/utils/logc';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET,
        });
    }

    /**
     * Set data into JWToken
     */
    async validate(payload: any) {
        // TODO : can add DB connection in order to retrieve more data for the JWToken
        // --- Can also be used to perform token revocation
        LogC.log(`+ JwtStrategy.validate( ${JSON.stringify(payload)})`, Color.FgYellow );
        return { userId: payload.sub, username: payload.username, role: payload.role };
    }
}