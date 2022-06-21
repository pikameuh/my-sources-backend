

import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsString } from "class-validator";
import { CreateDateManagerDto } from "./create-date-manager-dto";

export class  UpdateDateManagerDto extends PartialType(CreateDateManagerDto) {}
