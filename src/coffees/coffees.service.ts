import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Color } from 'src/common/enums/colors.enum';
import { LogC } from 'src/common/utils/logc';
// import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
/**
 *  Using TypeORM (SQL)
 */

/**
 * scope: 
 *  {} : DEFAULT
 *  DEFAULT : Singleton (share all over the application)
 *  TRANSIENT : Instantiate each time a module need it (dedciated import)
 *  REQUEST : new instance to provider excusivelly for input request
 */
@Injectable( { scope: Scope.DEFAULT })
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,

        private readonly connection: Connection,
        private readonly configService: ConfigService,  

        @Inject(coffeesConfig.KEY)
        private coffeesConfiguration: ConfigType<typeof coffeesConfig>,

        // @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    ) {        
        // console.log(COFFEE_BRANDS + ' loaded');
        // console.log(coffeeBrands);

        // const databasehost = this.configService.get<string>('DATABASE_HOST', 'localhost'); // here 'localhost' is the deault value
        // const databasehost = this.configService.get('database.host', 'localhost_default');
        // console.log(databasehost);

        // const coffeeConfig = this.configService.get('coffees.foo'); --> need magic strings ...
        // => better using @Inject( .KEY)
        // # Namespace -> strong typing (no get) + no typo
        LogC.log(coffeesConfiguration.foo, Color.FgWhite);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }
    
    async findOne(id: string) {
        // Populate flavors (relation) when retrieving coffees
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        });
        if (!coffee) {
            // throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
            throw new NotFoundException(`Coffee #${id} not found`);
        }

        return coffee;
    }
    
    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );
        LogC.log(`flavors: ${JSON.stringify(flavors)}`, Color.FgWhite);
        LogC.log(`createUscreateCoffeeDtoerDto: ${JSON.stringify(createCoffeeDto)}`, Color.FgWhite);


        // associate flavors with the coffee
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });

        LogC.log(`coffee: ${JSON.stringify(coffee)}`, Color.FgWhite);

        return this.coffeeRepository.save(coffee);
    }
    
    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors && // manage no error in case of flavor is not devined
        (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        ));
    
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }
    
    async remove(id: string) {
        const coffee = await this.coffeeRepository.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    /**
     * 
     * Transaction for assure the 2save are done, or we rollback
     */
    // async recommendCoffee(coffee: Coffee) {
    //     const queryRunner = this.connection.createQueryRunner();

    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();

    //     try {
    //         coffee.recommendations++;

    //         const recommendEvent = new Event();            
    //         recommendEvent.name = 'recommend_coffee';
    //         recommendEvent.type = 'coffee';
    //         recommendEvent.payload = { coffeeId: coffee.id };
        
    //         await queryRunner.manager.save(coffee); 
    //         await queryRunner.manager.save(recommendEvent);

    //         await queryRunner.commitTransaction();

    //     } catch (err) {
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ name });
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({ name });
    }
}
