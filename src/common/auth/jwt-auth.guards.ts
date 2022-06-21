import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { LogC } from 'src/common/utils/logc';
import { Color } from '../enums/colors.enum';
import { json } from 'stream/consumers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    

    constructor(private reflector: Reflector) {
        super();
    }

    // handleRequest(err: any, req: any, info: any, context: ExecutionContext) {
    //     LogC.log("**************************************: handleRequest("+JSON.stringify(req)+")", Color.FgGreen);
    //     const request = context.switchToHttp().getRequest();
    //     request.user = req.user;
    //     return req.user;
    // }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.        
        LogC.logTitle(`JwtAuthGuard.canActivate()`, Color.FgGreen);
        const methodKey = context.getHandler().name;
        const className = context.getClass().name;
        LogC.log(` + for ${className}.${methodKey}()`, Color.FgYellow);

        // if (this.isPublic(context)) { return true; }
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            LogC.log(` + public route`, Color.FgYellow);
            return true;
        } else {
            LogC.log(` + protected route`, Color.FgYellow);
        }

        return super.canActivate(context);
    }

    getRoles(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        return roles;
    }

}
