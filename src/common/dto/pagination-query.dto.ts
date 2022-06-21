import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional() // no error if missing
    @IsPositive()
    // @Type(() => Number) -> no need as declaration 'enableImplicitConversion' in main.ts, make it global
    limit: number;

    @IsOptional()
    @IsPositive()
    offset: number;
}
