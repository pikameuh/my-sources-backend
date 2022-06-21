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
import { object, string } from '@hapi/joi';

@Injectable()
export class DateManagerService {

    constructor(
        @InjectRepository(DateManager)
        private readonly dateManagerRepository: Repository<DateManager>,
        

        @Inject(usersConfig.KEY)
        private conf: ConfigType<typeof usersConfig>,
        private connection: Connection
    ) { }


    public async pushNewDateIntoDateManager(user: User, wantedArray: number) {

        if (wantedArray === -1) {
            LogC.log(` + ERROR pushNewDateIntoDateManager() can't find column -1`, Color.FgRed); 
            return;
        }

        let dto : UpdateDateManagerDto = user.dateManager;
        if (DateManagerColumns.CONNECTION_OK.code === wantedArray) {
            dto.d_connections_succeeded.push(new Date);
        } else if (DateManagerColumns.CONNECTION_KO.code === wantedArray) {
            dto.d_connections_failed.push(new Date);
        } else if (DateManagerColumns.ACTIVATION.code === wantedArray) {
            dto.d_activations.push(new Date);
        } else if (DateManagerColumns.PROFILE_UPD.code === wantedArray) {
            dto.d_profile_updated.push(new Date);
        } 

        return await this.dateManagerRepository.save(dto);
    }

    public tooManyAttemptForOneDay(user: User) {

        const today = new Date;
        let dto : UpdateDateManagerDto = user.dateManager;        
        const allFailedOfToday = dto.d_connections_failed.filter(day => this.datesAreOnSameDay(day, today));
        
        LogC.log(` + tooManyAttemptForOneDay()? allFailedOfToday.length = ${allFailedOfToday.length}`, Color.FgYellow); 
        const tooMany : boolean = (allFailedOfToday.length / 2 > 5);
        LogC.log(` ---> ${tooMany}\n`, Color.FgRed );

        return (allFailedOfToday.length / 2 > 5);
    }

    public  datesAreOnSameDay(first, second: Date) : boolean {

        try{
            LogC.log(` + ${first} <-> ${second.toDateString()}`, Color.FgCyan);
            const parsedFirst = new Date(first);
            LogC.log(` + parsedFirst : ${parsedFirst.toDateString()} `, Color.FgRed);
            return parsedFirst.toDateString() === second.toDateString();

        }catch(e){
            return false;
        }
        
        // LogC.log(` + ${typeof first}`, Color.FgRed);
        // // if (first instanceof object){
        //     const firstRes = first.substr(0, 10);
        //     LogC.log(` + datesAreOnSameDay()? ${firstRes} - ${second.getFullYear()}-${second.getMonth() + 1}-${second.getDate()}`, Color.FgYellow);
    
        //     const secondYear = second.getFullYear();
        //     const nbMonth = second.getMonth() + 1;
        //     const secondMonth = (nbMonth > 9)? nbMonth : '0' + nbMonth;
        //     const nbDay = second.getDate();
        //     const secondDay = (nbDay > 9)? nbDay : '0' + nbDay;
        //     const secondRes = secondYear + '-' + secondMonth + '-' + secondDay
    
        //     LogC.log(` + ${firstRes} === ${secondRes}`, Color.FgYellow);
    
    
        //     return firstRes === secondRes;
        // // }

        // return false;
    }

    


    public async preloadDateManagerById(id: number): Promise<DateManager> {
        const existingDM = await this.dateManagerRepository.findOne({ id });
        if (existingDM) {
            return existingDM;
        }

        throw new NotFoundException(existingDM, `DateManager #${id} not found`);
    }

    public createNewDateManagerEntry(passActivation: boolean) {
        LogC.log(`createNewDateManagerEntry(${passActivation})`, Color.FgGreen);
        
        let createDateManagerDto = new CreateDateManagerDto();
        const now = new Date();
        createDateManagerDto.d_creation = now;
        createDateManagerDto.d_connections_succeeded = [];
        createDateManagerDto.d_connections_failed = [];
        createDateManagerDto.d_activations = [];
        createDateManagerDto.d_profile_updated = [];

        if (passActivation) {
            LogC.log(`will push date activation ${now}`, Color.FgGreen);
            createDateManagerDto.d_activations.push(now);
            LogC.log(`done`, Color.FgGreen);
        }

        return this.dateManagerRepository.save(createDateManagerDto);
    }

    public async findOne(id) {
        const existingDM = await this.dateManagerRepository.findOne({ id });
        if (existingDM) {
            return existingDM;
        }

        throw new NotFoundException(existingDM, `DateManager #${id} not found`);
    }
}

