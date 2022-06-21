import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { JwtPayload } from "../auth/JwtPayload";
import { JwtRegisterPayload } from "../auth/JwtRegisterPayload";
import { Error } from "../enums/errors.enum";

export class JwtUtils {
    
    static extractToken(auth: string) {
        if (auth) {
            const base64Payload = auth.split('.')[1];
            const payloadBuffer = Buffer.from(base64Payload, 'base64');
            const updatedJwtPayload: JwtPayload = JSON.parse(payloadBuffer.toString()) as JwtPayload;
            return updatedJwtPayload;
        } else {
            throw new UnauthorizedException(Error.JWT_OUT_DATED);
        }
    }

    static extractRegisterToken(token: string) {
        if (token) {
            const base64Payload = token.split('.')[1];            
            const payloadBuffer = Buffer.from(base64Payload, 'base64');
            const updatedJwtPayload: JwtRegisterPayload = JSON.parse(payloadBuffer.toString()) as JwtRegisterPayload;
            return updatedJwtPayload;
        } else {
            throw new UnauthorizedException(Error.JWT_OUT_DATED);
        }
    }
}