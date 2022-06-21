import { Type, CanActivate, ExecutionContext, mixin, Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Color } from "src/common/enums/colors.enum";
import { Error } from "src/common/enums/errors.enum";
import { LogC } from 'src/common/utils/logc';
import { JwtAuthGuard } from "../jwt-auth.guards";

@Injectable()
export class RolesGuard extends JwtAuthGuard {

    constructor(reflector: Reflector) {
        super(reflector);
    }

    async canActivate(context: ExecutionContext) {
        LogC.logTitle(`RolesGuard.canActivate()`, Color.FgGreen);

        const roles = super.getRoles(context);
        if (!roles) {
            LogC.log(` + no role restriction for this endpoint \n`, Color.FgYellow);
            return true;
        } else {
            LogC.log(` + allowed roles ${ Color.FgGreen + JSON.stringify(roles)}`, Color.FgYellow);
        }

        const { user } = context.switchToHttp().getRequest();

        if(user?.role?.name) {
            const authorized = roles.some(role => role === user.role.name);   
            if (authorized) {
                LogC.log(` + role[${ Color.FgGreen + user.role.name + Color.FgYellow}] sufficient !`, Color.FgYellow);
            }  else {
                LogC.log(` + role[${ Color.FgGreen + user.role.name + Color.FgYellow}] not enougth..`, Color.FgRed);
            }
            return authorized;       

        } else {
            LogC.log(` + role[undefined], Error(${Error.JWT_OUT_DATED.code}) : ${Error.JWT_OUT_DATED.message}`, Color.FgRed);
            throw new UnauthorizedException(Error.JWT_OUT_DATED.message);
        }        
    }
}



// @Public()
//     @Patch()
//     async updateMyself(@Headers('Authorization') auth: string, @IP() Ip, @Body() updateMyselfUserDto: UpdateMyselfUserDto) {
        
//         const updatedJwtPayload: JwtPayload = JwtUtils.extractToken(auth);
//         this.logUpdateMyself( updatedJwtPayload, Ip);
//         return this.usersService.updateMyself(updatedJwtPayload.id, updateMyselfUserDto);
//     }