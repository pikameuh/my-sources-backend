import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { RolesGuard } from '../auth/strategies/roles.guards';
// import RolesGuard from '../auth/strategies/roles.guards';
import { Protocol } from '../decorators/protocol.decorator';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Role } from '../enums/role.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('roles')
@Controller('roles')
@UseGuards(RolesGuard)
export class RolesController {

    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Get('/init')
    async init() {

        let roleUser: CreateRoleDto = {name: 'user', description: 'A simple user'}
        await this.usersService.createRole(roleUser);

        let roleBuddy: CreateRoleDto = {name: 'buddy', description: 'An user, friend of Astek'}
        await this.usersService.createRole(roleBuddy);

        let roleLord: CreateRoleDto = {name: 'lord', description: 'An user with some granted privileges'}
        await this.usersService.createRole(roleLord);

        let roleAdmin: CreateRoleDto = {name: 'admin', description: 'An administrator of the website'}
        await this.usersService.createRole(roleAdmin);

        let roleAstek: CreateRoleDto = {name: 'astek', description: 'The website crafter'}
        await this.usersService.createRole(roleAstek);

        return {result: "ok"}
    }

    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOneRole(id);
    }

    // @Public()
    // @Roles(Role.Admin, Role.Astek)
    @Get()
    findAll() {
        return this.usersService.findAllRoles();
    }

   

    // @Public()
    // @Get('/init')
    // init() {
        
    //     let astek = new CreateUserDto({username: 'astek', pseudo:'astek', email:'astek@gmail.com', password: 'astek', role: 'astek'});
    //     this.usersService.create(astek);

    //     let admin = new CreateUserDto({username: 'admin', pseudo:'admin', email:'admin@gmail.com', password: 'admin', role: 'admin'});
    //     this.usersService.create(admin);

    //     let lord = new CreateUserDto({username: 'lord', pseudo:'astlordek', email:'lord@gmail.com', password: 'lord', role: 'lord'});
    //     this.usersService.create(lord);

    //     let buddy = new CreateUserDto({username: 'buddy', pseudo:'buddy', email:'buddy@gmail.com', password: 'buddy', role: 'buddy'});
    //     this.usersService.create(buddy);
        
    //     let user = new CreateUserDto({username: 'user', pseudo:'user', email:'user@gmail.com', password: 'user', role: 'user'});
    //     this.usersService.create(user);
    // }

    /**
     * Post method using Dto
     * @param CreateRoleDto 
     * @returns 
     */
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        // console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.usersService.createRole(createRoleDto);
    }

}
