import { PartialType } from "@nestjs/swagger";
import { CreateUserLowPrivilegeDto } from "./create-user-low-privilege.dto";

export class UpdateUserLowPrivilegeDto extends PartialType(CreateUserLowPrivilegeDto) {
    
}
