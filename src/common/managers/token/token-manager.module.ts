import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import usersConfig from "src/common/users/config/users.config";
import { Token } from "src/common/users/entities/token.entity";
import { User } from "src/common/users/entities/user.entity";
import { TokenManagerService } from "./token-manager.service";

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Token]), 
      ConfigModule.forFeature(usersConfig),
      // forwardRef(() => AuthModule),
    ],
    // controllers: [UsersController], 
    providers: [TokenManagerService],
    exports: [TokenManagerService],
  })
  export class TokenManagerModule {}