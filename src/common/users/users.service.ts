import { BadRequestException, forwardRef, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getConnection } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Color } from '../enums/colors.enum';
import { MailService } from '../mail/mail.service';
import { LogC } from '../utils/logc';
import usersConfig from './config/users.config';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { CreateUserFullDto } from './dto/create-user-full.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { DateManagerColumns } from "../enums/date-manager-columns.enum";
import { DateManagerService } from '../managers/date-manager/date-manager.service';
import { TokenManagerService } from '../managers/token/token-manager.service';
import { Error } from '../enums/errors.enum';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,      

        @Inject(usersConfig.KEY)
        private conf: ConfigType<typeof usersConfig>,

        private mailService: MailService,

        private connection: Connection,

        private dateManagerService: DateManagerService, 
        private tokenManagerService: TokenManagerService, 

    ) { }

    /** ########################## USER ##########################  */

    findOne(id: number) {
        const existingUser = this.usersRepository.find({
            where: { id: id },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `User #${id} not found`); }
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        const existingUsers = this.usersRepository.find({
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
            skip: offset,
            take: limit,
            // order: ['id', 'ASC'],
        });

        if (existingUsers) { return existingUsers; }
        else { throw new NotFoundException(existingUsers, `No user found`); }
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const existingUser = await this.usersRepository.findOne({
            where: { username: username },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `byUsername: User '${username}' not found`); }
    }

    async findByUsernameForLogin(username: string): Promise<User | undefined> {
        var existingUser = await this.usersRepository.findOne({
            where: { username: username },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `byUsername: User '${username}' not found`);  }
    }

    async saveLogginActivity(user: User, succeeded: boolean) {
        if (user) {
            LogC.log(` + saveLogginActivity - succeeded? ${succeeded}`, Color.FgMagenta); 

            let affectedColumn : number = -1;
            if (succeeded) { 
                affectedColumn = DateManagerColumns.CONNECTION_OK.code;           
            } else {
                affectedColumn = DateManagerColumns.CONNECTION_KO.code;
            }
            await this.dateManagerService.pushNewDateIntoDateManager(user, affectedColumn );
            
            // block brutforce attacks
            if ( !succeeded && this.dateManagerService.tooManyAttemptForOneDay(user)) {
                await this.desactivateUser(user.id);
                LogC.log(`+ throw UnauthorizedException {code: ${Error.BRUT_FORCE.code}, name: ${Error.BRUT_FORCE.name}}`, Color.FgRed );
                throw new UnauthorizedException(Error.BRUT_FORCE);
            }
        }
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: email },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `byEmail: User '${email}' not found`); }
    }

    async findByPseudo(pseudo: string): Promise<User | undefined> {
        const existingUser = await this.usersRepository.findOne({
            where: { pseudo: pseudo },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `byPseudo: User '${pseudo}' not found`); }
    }

    async isNewUser(createUserDto: CreateUserDto): Promise<boolean> {
        LogC.log(`isNewUser()`, Color.FgGreen);

        try {
            const byUsername = await this.findByUsername(createUserDto.username);
            LogC.log(`byUsername: ${byUsername}`, Color.FgGreen);
            if (byUsername) { return false }
        } catch (e) { }

        try {
            const byPseudo = await this.findByPseudo(createUserDto.pseudo);
            LogC.log(`byPseudo: ${byPseudo}`, Color.FgGreen);
            if (byPseudo) { return false }
        } catch (e) { }

        try {
            const byEmail = await this.findByEmail(createUserDto.email);
            LogC.log(`byEmail: ${byEmail}`, Color.FgGreen);
            if (byEmail) { return false }
        } catch (e) { }

        LogC.log(`return true;`, Color.FgGreen);
        return true;
    }

    async isEmailAlreadyExists(email: string) {
        LogC.log(`isEmailAlreadyExists(${email})`, Color.FgGreen);
        try {
            const byEmail = await this.findByEmail(email);
            LogC.log(`byEmail: ${byEmail}`, Color.FgGreen);
            if (byEmail) { return true }
        } catch (e) { }

        return false;

    }

    async isValidForRendngRegistrationCofirmationEmail(email: string) {
        LogC.log(`isEmailAlreadyExists(${email})`, Color.FgGreen);
        try {
            const byEmail = await this.findByEmail(email);
            LogC.log(`byEmail: ${JSON.stringify(byEmail.is_registered)}`, Color.FgGreen);
            if (byEmail && !byEmail.is_registered) { return true }
        } catch (e) { }

        return false;
    }

    async findByPayload({ username }: any): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { username },
            relations: [this.conf.role, this.conf.token, this.conf.dateManager],
        });

        if (existingUser) { return existingUser; }
        else { throw new NotFoundException(existingUser, `User '${username}' not found (from payload)`); }
    }
2
    /** */
    async create(createUserDto: CreateUserDto, register_token) {
        LogC.log(`UsersService.create: ${JSON.stringify(createUserDto)} \n ${register_token}`, Color.FgGreen );
        const role = await Promise.resolve(this.preloadRoleByName('user'));

        return await this.createUserWithRoleAndToken(createUserDto, role, register_token);
    }

    async createWithRole(createUserDto: CreateUserFullDto, roleName: string) {
        const role = await Promise.resolve(this.preloadRoleByName(roleName));
        return await this.createUserWithRoleAndToken(createUserDto, role, '');
    }

    async createUserWithRoleAndToken(createUserDto: CreateUserDto, role: Role, registerToken: string){
        const queryRunner = this.connection.createQueryRunner();

        const passActivation: boolean = (registerToken === '') ? true : false;

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {

            LogC.log(`createUserDto: ${JSON.stringify(createUserDto)}`, Color.FgWhite );
            LogC.log(`ROLE: ${JSON.stringify(role)}`, Color.FgWhite );

            const dto: CreateTokenDto = { register_token: registerToken, reset_pwd_token: '' };
            LogC.log(`dto: ${JSON.stringify(dto)}`, Color.FgWhite );

            const token = await Promise.resolve(this.tokenManagerService.createNewTokenEntry(dto));
            LogC.log(`token: ${JSON.stringify(token)}`, Color.FgWhite );

            const dateManager = await Promise.resolve(this.dateManagerService.createNewDateManagerEntry(passActivation));
            LogC.log(`dateManager: ${JSON.stringify(dateManager)}`, Color.FgWhite );
            



            // Hash password
            const hashed = await this.ashPassword(createUserDto.password);

            const user = await this.usersRepository.create({
                ...createUserDto,
                password: hashed,
                activated: passActivation,
                is_registered: passActivation,
                role,
                token,
                dateManager,
            });

            console.log(`user: ${JSON.stringify(user)}`);



            const result = await this.usersRepository.save(user);
            // const result = await queryRunner.manager.save(user);
            if (result) {
                await queryRunner.commitTransaction();
                // send email
                this.mailService.sendUserConfirmation(user, token.register_token);
                return result;
            }
            
        } catch (err) {
            // since we have errors lets rollback the changes we made
            LogC.log(`Error: ${err} \n rollback transaction..`, Color.FgRed );
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async resndResgisterConfirmation(email: string, token: string) {
        LogC.log(`resndResgisterConfirmation(${email})`, Color.FgGreen);
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Can't resend confirm mail registration for ${email}`);
        }

        user.token.register_token = token;

        this.usersRepository.save(user);
        this.mailService.reSendUserConfirmation(user, user.token.register_token);
        return user;

    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const role = updateUserDto.role && // manage no error in case of flavor is not devined
            (
                await Promise.resolve(this.preloadRoleByName(updateUserDto.role))
            )

            // TODO : update dateManager
            

        const user = await this.usersRepository.preload({
            id: id,
            ...updateUserDto,
            role,
            token: { id: 0, register_token: '', reset_pwd_token: '' },
        });
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return this.usersRepository.save(user);
    }

    /** */
    async swapUserIsActivated(id: number): Promise<boolean> {
        const user = await this.usersRepository.preload({ id: id });
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        let userWithDateManager = await this.findByPseudo(user.pseudo);
        userWithDateManager.activated = !user.activated;

        await this.usersRepository.save(userWithDateManager);
        await this.dateManagerService.pushNewDateIntoDateManager(userWithDateManager, DateManagerColumns.ACTIVATION.code);

        return userWithDateManager.activated;
    }

    async desactivateUser(id: number): Promise<boolean> {
        const user = await this.usersRepository.preload({ id: id });
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        let userWithDateManager = await this.findByPseudo(user.pseudo);
        if ( userWithDateManager.activated){
            userWithDateManager.activated = false;
        }

        await this.usersRepository.save(userWithDateManager);
        await this.dateManagerService.pushNewDateIntoDateManager(userWithDateManager, DateManagerColumns.ACTIVATION.code);

        return userWithDateManager.activated;
    }


    async confirmRegistration(email: string) {
        LogC.log(`confirmRegistration(${email})`, Color.FgGreen);
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Can't confirm registration for ${email}`);
        }

        user.token.register_token = '';
        const token = user.token;
        user.is_registered = true;

        this.usersRepository.save(user);
        this.tokenManagerService.save(token);
        return user;
    }

    async updateRole(newRole: UpdateUserRoleDto) {
        const user = await this.usersRepository.preload({ id: newRole.id });

        console.log(`updateRole : ${JSON.stringify(newRole)}`);
        if (!user) {
            throw new NotFoundException(`User #${newRole.id} not found`);
        }
        console.log(`user exists`);


        const role = newRole.name && // manage no error in case of flavor is not devined
            (
                await Promise.resolve(this.preloadRoleByName(newRole.name))
            )
        if (!role) {
            throw new NotFoundException(`Role #${newRole.name} not found`);
        }
        console.log(`role exists`);

        user.role = role;

        this.usersRepository.save(user);
        return user;
    }

    async updateMyself(id: number, updateUserDto: UpdateUserDto) {

        let req = await this.constructReqUpdateMyself(id, updateUserDto);

        console.log(`updateMyself : ${JSON.stringify(req)}`);

        const user = await this.usersRepository.preload(req);
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return this.usersRepository.save(user);
    }


    async deleteUser(id: number) {
        const user = await this.usersRepository.findOne({ id: id });
        return await this.usersRepository.remove(user);
    }

    async deleteAllUsers() {
        const repository = getConnection().getRepository(User.name); // Get repository
        return await repository.clear();
    }



    /** ########################## ROLE ##########################     */

    /**
     * 
     * @returns 
     */
    async findOneRole(id: number) {
        return await this.preloadRoleById(id);
    }

    findAllRoles() {
        return this.rolesRepository.find();
    }

    async createRole(createRoleDto: CreateRoleDto) {
        return this.rolesRepository.save(createRoleDto);
    }

    private async preloadRoleById(id: number): Promise<Role> {
        const existingRole = await this.rolesRepository.findOne({ id });
        if (existingRole) {
            return existingRole;
        }

        throw new NotFoundException(existingRole, `Role #${id} not found`);
    }

    private async preloadRoleByName(name: string): Promise<Role> {
        const existingRole = await this.rolesRepository.findOne({ name });
        if (existingRole) {
            return existingRole;
        }

        throw new NotFoundException(existingRole, `Role '${name}' not found`);
    }

   


    async ashPassword(password: string) {
        // Hash password
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(6);
        const hashed = await bcrypt.hash(password, salt);
        console.log(`bcrypt - ${hashed}`);
        return hashed;
    }

    /**
     * 
     * @param id Can update only pseudo and password
     * @param updateUserDto 
     * @returns 
     */
    async constructReqUpdateMyself(id: number, updateUserDto: UpdateUserDto) {

        const hasPseudo: string = updateUserDto?.pseudo;
        const hasPwd: string = updateUserDto?.password;
        console.log('*' + hasPseudo);
        console.log(hasPwd);

        let req;
        if (updateUserDto?.password && updateUserDto?.pseudo) {
            const hashed = await this.ashPassword(updateUserDto.password);
            console.log(`${hashed}`);
            req = {
                id: id,
                pseudo: updateUserDto.pseudo,
                password: hashed,
            };
        } else if (updateUserDto?.pseudo) {
            req = {
                id: id,
                pseudo: updateUserDto.pseudo,
            };

        } else if (updateUserDto?.password) {
            const hashed = await this.ashPassword(updateUserDto.password);
            console.log(`${hashed}`);
            req = {
                id: id,
                password: hashed,
            };
        } else {
            throw new BadRequestException(`Need at least a pseudo or a password`);
        }

        return req;
    }
}

