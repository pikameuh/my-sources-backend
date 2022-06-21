import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getConnection } from 'typeorm';
import { Color } from '../../enums/colors.enum';
import { LogC } from '../../utils/logc';
import { DateManagerColumns } from "../../enums/date-manager-columns.enum";
import usersConfig from '../../users/config/users.config';
import { CreateDateManagerDto } from '../../users/dto/create-date-manager-dto';
import { UpdateDateManagerDto } from '../../users/dto/update-date-manager-dto';
import { DateManager } from '../../users/entities/date-manager.entity';
import { User } from '../../users/entities/user.entity';
import { Token } from 'src/common/users/entities/token.entity';
import { CreateTokenDto } from 'src/common/users/dto/create-token.dto';

@Injectable()
export class TokenManagerService {

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,   
        

        @Inject(usersConfig.KEY)
        private conf: ConfigType<typeof usersConfig>,
        private connection: Connection
    ) { }

    public async preloadTokenById(id: number): Promise<Token> {
        const existingToken = await this.tokenRepository.findOne({ id });
        if (existingToken) {
            return existingToken;
        }

        throw new NotFoundException(existingToken, `Token #${id} not found`);
    }

    public createNewTokenEntry(createTokenDto: CreateTokenDto) {
        return this.tokenRepository.save(createTokenDto);
    }  

    public save(token) {
        this.tokenRepository.save(token);
    }
}

