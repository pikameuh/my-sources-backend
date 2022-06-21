import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsPositive, IsString } from "class-validator";

export class EmailDto {
    // @IsOptional() // no error if missing
    @IsEmail()
    // @Type(() => Number) -> no need as declaration 'enableImplicitConversion' in main.ts, make it global
    email: string;

}
