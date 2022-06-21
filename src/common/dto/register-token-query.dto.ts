import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString } from "class-validator";

export class RegisterTokenQueryDto {
    // @IsOptional() // no error if missing
    @IsString()
    // @Type(() => Number) -> no need as declaration 'enableImplicitConversion' in main.ts, make it global
    token: string;

}
