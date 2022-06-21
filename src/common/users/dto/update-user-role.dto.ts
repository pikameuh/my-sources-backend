import { ApiProperty } from "@nestjs/swagger";
import {  IsNumber, IsString } from "class-validator";

export class UpdateUserRoleDto {

    @ApiProperty({ description: 'The id of the user to update' })
    @IsNumber()
    readonly id: number;

    @ApiProperty({ description: 'The name of the new role' })
    @IsString()
    readonly name: string;
}
