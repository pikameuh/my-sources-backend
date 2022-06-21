import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsString, ValidateNested } from "class-validator";
import { Role } from "../entities/role.entity";

export class CreateUserFullDto {

    @ApiProperty({ description: 'Is the account activated?' })
    @IsBoolean()
    activated: boolean;

    @ApiProperty({ description: 'The username of the user (for loggin).' })
    @IsString()
    readonly username: string;

    @ApiProperty({ description: 'The pseudonyme of the user (display in the UI).' })
    @IsString()
    readonly pseudo: string;

    @ApiProperty({ description: 'The email of the user.' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'The password of the user.' })
    @IsString()
    readonly password: string;

    @ApiProperty({ description: 'The date of creation of the account.' })
    @IsDate()
    d_creation: Date;

    // @ApiProperty({ description: 'The dates of updates of the account.' })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => Date)
    // d_update: Date[];

    // @ApiProperty({ description: 'The dates of connections of the user.' })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => Date)
    // d_connection: Date[];

    @ApiProperty({ description: 'The authenticated role of the user.' })
    @IsString()
    role: string;

    @ApiProperty({ description: 'The tokens elemnt id.' })
    @IsNumber()
    token: number;

    // @ApiProperty({ description: 'The token used to finalize the registration.' })
    // @IsString()
    // register_token: string;

    @ApiProperty({ description: 'Is the user registered?' })
    @IsBoolean()
    is_registered: boolean;
}
