import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsEmail, IsDate } from "class-validator";

export class UserDto {  
    @ApiProperty({ description: 'Is the account activated?' })
    @IsBoolean()
    activated: boolean;

    @ApiProperty({ description: 'The pseudonyme of the user (display in the UI).' })
    @IsString()
    readonly pseudo: string;

    @ApiProperty({ description: 'The email of the user.' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'The date of creation of the account.' })
    @IsDate()
    d_creation: Date;

    @ApiProperty({ description: 'The authenticated role of the user.' })
    @IsString()
    role: string;
}