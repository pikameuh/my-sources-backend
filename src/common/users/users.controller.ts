import { Body, Controller, Request, Headers, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/JwtPayload';
import { RolesGuard } from '../auth/strategies/roles.guards';
import { IP } from '../decorators/ip.decorator';
import { Log } from '../decorators/log.decorator';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthUser } from '../decorators/user.decorator';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Color } from '../enums/colors.enum';
import { Role } from '../enums/role.enum';
import { LogC } from 'src/common/utils/logc';
import { JwtUtils } from '../utils/jwtUtils';
// import { CreateUserFullDto } from './dto/create-user-full.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UpdateUserLowPrivilegeDto } from './dto/update-user-low-privilege.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Error } from '../enums/errors.enum';
import { CreateUserFullDto } from './dto/create-user-full.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AuthService } from '../auth/auth.service';
import { RegisterTokenQueryDto } from '../dto/register-token-query.dto';
import { EmailDto } from '../dto/email.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    //, private readonly jwtUtil: JWTUtil,) { }
    // , private readonly jwtService: JwtService) {}

    @Public()
    @Get('/init')
    async init() {

        // let roleUser: CreateRoleDto = {name: 'User', description: 'A simple user'}
        // await this.usersService.createRole(roleUser);

        // let roleBuddy: CreateRoleDto = {name: 'Buddy', description: 'An user, friend of Astek'}
        // await this.usersService.createRole(roleBuddy);

        // let roleLord: CreateRoleDto = {name: 'LOrd', description: 'An user with some granted privileges'}
        // await this.usersService.createRole(roleLord);

        // let roleAdmin: CreateRoleDto = {name: 'Admin', description: 'An administrator of the website'}
        // await this.usersService.createRole(roleAdmin);

        // let roleAstek: CreateRoleDto = {name: 'Astek', description: 'The website crafter'}
        // await this.usersService.createRole(roleAstek);
        
        let astek: CreateUserFullDto = {username: 'astek', pseudo:'astek', email:'astek@gmail.com', password: 'astek', role: 'astek', activated: true, d_creation: new Date(), is_registered: true, token: 0};
        await this.usersService.createWithRole(astek, 'astek');

        let admin: CreateUserFullDto = {username: 'admin', pseudo:'admin', email:'admin@gmail.com', password: 'admin', role: 'admin', activated: true, d_creation: new Date(), is_registered: true, token: 0};
        await this.usersService.createWithRole(admin, 'admin');

        let lord: CreateUserFullDto = {username: 'lord', pseudo:'lord', email:'lord@gmail.com', password: 'lord', role: 'lord', activated: true, d_creation: new Date(), is_registered: true, token: 0};
        await this.usersService.createWithRole(lord, 'lord');

        let buddy: CreateUserFullDto = {username: 'buddy', pseudo:'buddy', email:'buddy@gmail.com', password: 'buddy', role: 'buddy', activated: true, d_creation: new Date(), is_registered: true, token: 0};
        await this.usersService.createWithRole(buddy, 'buddy');
        
        let user: CreateUserFullDto = {username: 'user', pseudo:'user', email:'user@gmail.com', password: 'user', role: 'user', activated: true, d_creation: new Date(), is_registered: true, token: 0};
        await this.usersService.createWithRole(user, 'user');

        return {result: "ok"}
    }

    @Get('/myself')
    findMySelf(@Headers('Authorization') auth: string) {       
        const updatedJwtPayload: JwtPayload = JwtUtils.extractToken(auth);
        this.logReqBy(updatedJwtPayload);
        return this.usersService.findOne(updatedJwtPayload.id);
    }

    @Public()
    @Get('/confirmation')
    async confirmResitration(@Query() registerTokenQuery: RegisterTokenQueryDto) {
        LogC.log(`confirmRegitration(${JSON.stringify(registerTokenQuery)})`, Color.FgGreen);

        if (this.authService.isJWtStillValid(registerTokenQuery.token)) {
            LogC.log(`register_token still valids`, Color.FgGreen);
            const payload = JwtUtils.extractRegisterToken(registerTokenQuery.token);
            const user = await this.usersService.confirmRegistration(payload.email);
            if (user) {
                LogC.log(`updated`, Color.FgGreen);
                return user;
            } else {
                LogC.log(`error during confirmRegistration()`, Color.FgRed);
                throw new InternalServerErrorException(`error during confirmation registration process..`);
            }
        } else {
            LogC.log(`register_token outdated`, Color.FgRed);
            throw new UnauthorizedException(Error.JWT_OUT_DATED);
        }
    }

    @Public()
    @Post('/resendconfirmationemail')
    async resendRegisterConfirmationMail(@Body() email: EmailDto) {
        LogC.log(`resendconfirmationemail(${email.email})`, Color.FgGreen);
        

        if (await this.usersService.isValidForRendngRegistrationCofirmationEmail(email.email)){
            const register_token = this.authService.createRegisterToken(email.email);
            return this.usersService.resndResgisterConfirmation(email.email, register_token);
        } else {
            throw new UnauthorizedException(`User ${email.email} is already registered..`);
        }
    }

    @Get(':id')
    find(@Headers('Authorization') auth: string, @Param('id', ParseIntPipe) id: number) {
        this.logReqBy(JwtUtils.extractToken(auth));

        return this.usersService.findOne(id);
    }

    // @Roles(Role.Admin, Role.Astek)
    @Public()
    @Get()
    findAll(@Headers('Authorization') auth: string, @Query() paginationQuery: PaginationQueryDto) {
        this.logReqBy(JwtUtils.extractToken(auth));

        return this.usersService.findAll(paginationQuery);
    }

    

    @Public()
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        LogC.log(` --------- CREATE USER ---------`, Color.FgWhite );
        const register_token = this.authService.createRegisterToken(createUserDto.email);
        LogC.log(`register_token: ${register_token}`, Color.FgWhite );

        if (await this.usersService.isNewUser(createUserDto)){
            LogC.log(`new user`, Color.FgWhite );
            return this.usersService.create(createUserDto, register_token);
        } else {
            throw new UnauthorizedException(`User: ${JSON.stringify(createUserDto)} already exists in database..`);
        }
    }

    @Patch()
    async updateMyself(@Headers('Authorization') auth: string, @IP() Ip, @Body() updateUserLPDto: UpdateUserLowPrivilegeDto) {
        
        const updatedJwtPayload: JwtPayload = JwtUtils.extractToken(auth);
        this.logReqBy(updatedJwtPayload);

        this.logUpdateMyself( updatedJwtPayload.id, Ip, updateUserLPDto, );   
        return this.usersService.updateMyself(updatedJwtPayload.id, updateUserLPDto);
    }

    @Roles(Role.Lord, Role.Admin, Role.Astek)
    @Patch('/updaterole')
    updateRole(@Body() updateUserDto: UpdateUserRoleDto, @IP() Ip) {
        // this.logUpdate(id, Ip, updateUserDto);
        LogC.log(` --------- USER ROLE ---------`, Color.FgWhite );
        // this.logReqBy(JwtUtils.extractToken(auth));

        return this.usersService.updateRole(updateUserDto);
    }

    @Roles(Role.Admin, Role.Astek)
    @Patch(':id')
    update(@Headers('Authorization') auth: string, @Log('UsersController.update()') l, @Param('id', ParseIntPipe) id: number, @IP() Ip, @Body() updateUserDto: UpdateUserDto) {
        this.logUpdate(id, Ip, updateUserDto);
        this.logReqBy(JwtUtils.extractToken(auth));

        return this.usersService.update(id, updateUserDto);
    }

    

    /**
     * Active and desaactive an user
     * @param auth 
     * @param id 
     * @param Ip 
     * @param updateUserLPDto 
     * @returns 
     */
    // @Public()
    @Roles(Role.Admin, Role.Astek)
    @Patch('/activate/:id')
    async activateUser(@Headers('Authorization') auth: string, @Param('id', ParseIntPipe) id: number, @IP() Ip, @Body() updateUserLPDto: UpdateUserLowPrivilegeDto) {
        
        

        const updatedJwtPayload: JwtPayload = JwtUtils.extractToken(auth);        
        this.logReqBy(updatedJwtPayload);

        const requesterRole = updatedJwtPayload.role;
        const userToUpdate = await this.usersService.findOne(id);
        let newState: boolean = userToUpdate[0]?.activated;
        
        if (requesterRole?.name && userToUpdate[0]?.role.name) {
            LogC.log(`requester role: ${requesterRole?.name}, user to update role: ${userToUpdate[0]?.role.name}`, Color.FgYellow);
            if (this.allowToUpdate(requesterRole.name, userToUpdate[0]?.role.name)){
                LogC.log(`Allowed`, Color.FgGreen);
                newState = await this.usersService.swapUserIsActivated(id);
            } else {
                LogC.log(`insuffisient rights`, Color.FgRed);
                throw new UnauthorizedException(Error.NOT_ENOUGHT_RIGHT_FOR_ACTION);
            }
        } else {
            LogC.log(`at least one of role is missing : \n++++requester role: ${requesterRole?.name}, user to uodate role: ${JSON.stringify(userToUpdate[0])}`, Color.BgRed);
        }

        // const newState = await this.usersService.activeUser(id);
        // this.logActiveUser( id, updatedJwtPayload.id, Ip, newState );
        return { new_state: newState};
    }

    allowToUpdate(reqRoleName: string, uToUpdateRoleName: string) {
        if( reqRoleName === Role.Astek) {
            if (uToUpdateRoleName === Role.Astek) {
                return false;
            } else {
                return true;
            }
        } else if( reqRoleName === Role.Admin) {
            if (uToUpdateRoleName === Role.Admin || uToUpdateRoleName === Role.Astek) {
                return false;
            } else {
                return true;
            }
        } else if( reqRoleName === Role.Lord) {
            if (uToUpdateRoleName === Role.User || uToUpdateRoleName === Role.Buddy) {
                return true;
            } else {
                return false;
            }
        }
    }
  


    @Delete(':id')
    delete( @Headers('Authorization') auth: string, @Param('id', ParseIntPipe) id: number, @IP() Ip) {
        this.logDelete(id, Ip);
        this.logReqBy(JwtUtils.extractToken(auth));

        const deletedUSer = this.usersService.deleteUser(id);
        return deletedUSer;
    }

    @Public()
    @Delete()
    deleteAll(@IP() Ip, @Headers('Authorization') auth: string) {
        this.logDelete(-1, Ip);       
        this.logReqBy(JwtUtils.extractToken(auth));
        
        return this.usersService.deleteAllUsers();
    }


    /**
     * LOGS
     */
    logReqBy(updatedJwtPayload: JwtPayload){
        LogC.log(` + requested by user #${updatedJwtPayload.id} ${updatedJwtPayload.pseudo} ${updatedJwtPayload.email}, [${updatedJwtPayload.role.name}], [${updatedJwtPayload.date_manager.d_creation}]`, Color.FgRed );   
    }

    logActiveUser(idToUpdate: number, idRequester: number, ip: string, newState: boolean) {
        let c: Color;
        let title: string;
        if  (newState) { 
            c = Color.FgGreen;
            title = ` --------- ACTIVE USER ---------`;
        } else { 
            c = Color.FgRed;
            title = ` --------- DESACTIVE USER ---------`;;
        }
        LogC.log(` --------- DE/ACTIVE USER ---------`, c );
        LogC.log(`#${idRequester} request update for ${idToUpdate}`, c );     
    }
    
    logUpdateMyself(id: number, ip: string, updateUserDto: UpdateUserDto) {
        LogC.log(` --------- USER UPDATE HIMSELF ---------`, Color.FgWhite );
        this.logGeneric(id, ip, updateUserDto);       
    }

    logUpdateRole(id: number, ip: string, updateUserDto: UpdateUserDto) {
        LogC.log(` --------- USER ROLE ---------`, Color.FgWhite );
        this.logGeneric(id, ip, updateUserDto);       
    }

    logUpdate(id: number, ip: string, updateUserDto: UpdateUserDto) {
        LogC.log(` --------- UPDATE USER ---------`, Color.FgRed )
        this.logGeneric(id, ip, updateUserDto);
    }

    logGeneric(id: number, ip: string, updateUserDto: UpdateUserDto){
        LogC.log(` - Update user #${id} requested from ${ip}`, Color.FgYellow );
        LogC.log(` - updateUserDto: ${JSON.stringify(updateUserDto)}`, Color.FgYellow );
    }

    logDelete(id: number, ip: string) {
        LogC.log(` --------- DELETE USER ---------`, Color.FgRed);
        (id === -1)
            ? LogC.log(` - Delete all user requested from ${ip}`, Color.FgRed)
            : LogC.log(` - Delete user #${id} requested from ${ip}`, Color.FgRed);
    }
}
