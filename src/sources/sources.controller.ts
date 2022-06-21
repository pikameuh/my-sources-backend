import { Body, Controller, Request, Headers, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Color } from 'src/common/enums/colors.enum';
import { UsersService } from 'src/common/users/users.service';
import { JwtUtils } from 'src/common/utils/jwtUtils';
import { LogC } from 'src/common/utils/logc';

@ApiTags('sources')
@Controller('sources')
export class SourcesController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }


    // @Get('/')
    // hello() {       
    //     return 'YES' !
    // }

    @Public()
    @Get()
    findAll(@Headers('Authorization') auth: string, @Query() paginationQuery: PaginationQueryDto) {
        const user_id = JwtUtils.extractToken(auth).id;
        LogC.log(`Sources.findAll(${user_id})`, Color.FgGreen);

        // TODO : sourcesService.findAllSourcesOf(user_id)
        return `res for : ${user_id}`;
    }
}
