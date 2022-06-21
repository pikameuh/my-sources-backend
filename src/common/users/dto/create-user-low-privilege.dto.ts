import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsEmail, IsString, ValidateNested } from "class-validator";

export class CreateUserLowPrivilegeDto {

    @ApiProperty({ description: 'The pseudonyme of the user (display in the UI).' })
    @IsString()
    readonly pseudo: string;

    @ApiProperty({ description: 'The password of the user.' })
    @IsString()
    readonly password: string;
}
