import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import { JwtPayload } from './JwtPayload';
import { Role } from '../users/entities/role.entity';
import { LogC } from '../utils/logc';
import { Color } from '../enums/colors.enum';
import { Error } from '../enums/errors.enum';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        // @Inject(forwardRef(() => UsersService))//<--- here
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        LogC.log(` + AuthService.validateUser( ${Color.FgGreen} ${username}, ***** ${Color.FgYellow})`, Color.FgYellow );

        var user: User;
        let err = false;
        try {
            user = await this.usersService.findByUsernameForLogin(username);
            // IS user not logged yet
            // const isUserLogged: boolean = user.token.
            // Only valid activated uers
            if (user?.activated && user?.is_registered) {        
                const bcrypt = require('bcrypt');
                const pwdMatches = await bcrypt.compare(pass, user.password);

                if (user && pwdMatches) {
                    // Remove password from JSON user
                    await this.usersService.saveLogginActivity(user, true);
                    const { password, ...result } = user;
                    return result;
                }
                
                await this.usersService.saveLogginActivity(user, false);
                
            } else {
                LogC.log(`+ throw UnauthorizedException {code: ${Error.USER_UNACTIVATED.code}, name: ${Error.USER_UNACTIVATED.name}}`, Color.FgRed );
                throw new UnauthorizedException(Error.USER_UNACTIVATED);
            }

        } catch (e) {
            LogC.log(` + Exception catched: ${e}`, Color.FgRed );
            if ( e instanceof UnauthorizedException ) {
                throw e;
            } else {

                LogC.log(`+ throw UnauthorizedException {code: ${Error.INVALID_CREDENTIALS.code}, name: ${Error.INVALID_CREDENTIALS.name}}`, Color.FgRed );
                throw new UnauthorizedException(Error.INVALID_CREDENTIALS);
            }
        }

       // await this.usersService.saveLogginActivity(user, false);

        LogC.log(`+ throw UnauthorizedException {code: ${Error.INVALID_CREDENTIALS.code}, name: ${Error.INVALID_CREDENTIALS.name}}`, Color.FgRed );
        throw new UnauthorizedException(Error.INVALID_CREDENTIALS);
    }

    async login(user: any) {
        LogC.log(` + AuthService.login( ${Color.FgGreen}  ${JSON.stringify(user)} ${Color.FgYellow} )`, Color.FgYellow );

        // generate and sign token   
        const token = this._createToken(user);

        // add date in DB login_date

        return {
            id: user.id,
            pseudo: user.pseudo, 
            ...token,
        };
    }

    /**
     * Create a JWToken using JwtPayload
     */
    private _createToken(user: any): any {
        const userPayload: JwtPayload = {
            id: user.id, 
            // activated: user.activated, 
            pseudo: user.pseudo, 
            email: user.email, 
            role:
            {
                id: user.role.id,
                name: user.role.name,
                description: user.role.description
            },
            date_manager: {
                id: user.dateManager.id,
                d_creation: user.dateManager.d_creation, 
                d_activations: user.dateManager.d_activations, 
                d_connections_succeeded: user.dateManager.d_connections_succeeded, 
                d_connections_failed: user.dateManager.d_connections_failed, 
                d_profile_updated:user.dateManager.d_profile_updated, 
            }
        };
        const accessToken = this.jwtService.sign(userPayload);
        return {
            expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
            accessToken,
        };
    }

    createRegisterToken(email: string) {
        const userPayload = {email: email};
        const register_token = this.jwtService.sign(userPayload);
        return register_token;
    }

    isJWtStillValid(token: any) {
        return this.jwtService.verify(token);
    }
}