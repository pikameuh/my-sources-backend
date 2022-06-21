import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({ description: 'The name of the role' })
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'The description of the role' })
    @IsString()
    readonly description: string;
}
