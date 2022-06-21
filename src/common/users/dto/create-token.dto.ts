import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateTokenDto {

    @ApiProperty({ description: 'The token to register' })
    @IsString()
    readonly register_token: string;

    @ApiProperty({ description: 'The token to reset the password' })
    @IsString()
    readonly reset_pwd_token: string;
}
