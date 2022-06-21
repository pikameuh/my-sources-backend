import { OmitType } from "@nestjs/swagger";
import { CreateUserFullDto } from "./create-user-full.dto";

export class CreateUserDto extends OmitType(CreateUserFullDto, ['role', 'activated', 'd_creation', 'is_registered', 'token'] as const) {}