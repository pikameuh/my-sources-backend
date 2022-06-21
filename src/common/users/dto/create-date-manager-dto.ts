

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsString } from "class-validator";

export class CreateDateManagerDto {

    @ApiProperty({ description: 'The date of the creation of the first registration token' })
    @IsDate()
    d_creation: Date;

    @ApiProperty({ description: 'The list of date when the user has been activated or desactivated' })
    @IsArray()
    @Type(() => Date)
    d_activations: Date[];

    @ApiProperty({ description: 'The list of date when the user login successfully' })
    @IsArray()
    @Type(() => Date)
    d_connections_succeeded: Date[];

    @ApiProperty({ description: 'The list of date when the user failed to login' })
    @IsArray()
    @Type(() => Date)
    d_connections_failed: Date[];

    @ApiProperty({ description: 'The list of date when the user\'s profile has been updated' })
    @IsArray()
    @Type(() => Date)
    d_profile_updated: Date[];
}
