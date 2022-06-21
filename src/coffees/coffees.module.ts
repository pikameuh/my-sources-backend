import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { async } from 'rxjs';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// --- (/)
// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

// --- (+)
// allow to return any values for the provider
// @Injectable()
// export class CoffeeBrandsFactory {
//     create() {
//         /** ... do something */
//         return ['buddy brew', 'nescafe'];
//     }
// }

// --- (\)

/**
 * Allows to have clean organisation, 
 * instead of having all declarations into app.module
 */
// @Module({ 
//     imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
//     controllers: [CoffeesController], 
//     providers:  [
//         CoffeesService,    
//         // --- (+) 
//         // CoffeeBrandsFactory,    

//         // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe']},

//         // --- (\) async providers
//         // Asynchronous "useFactory" (async provider example)
//         {
//             provide: 'COFFEE_BRANDS',
//             // Note "async" here, and Promise/Async event inside the Factory function 
//             // Could be a database connection / API call / etc
//             // In our case we're just "mocking" this type of event with a Promise
//             useFactory: async (connection: Connection): Promise<string[]> => {
//                 const coffeeBrands = await connection.query('SELECT DISTINCT brand FROM coffee');
//                 // const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
//                 console.log('[!] Async factory');
//                 return coffeeBrands;
//             },
//             inject: [Connection],
//         },
        
//         // --- (+) Using useFactory
//         // { provide: COFFEE_BRANDS, useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(), inject: [CoffeeBrandsFactory]},

//         // --- (/) Manage loading service in fct of ...
//         // {
//         //     provide: ConfigService,
//         //     useClass: process.env.NODE_ENV == 'development' 
//         //         ? DevelopmentConfigService
//         //         : ProductionConfigService
//         // },
//     ],
//     exports:  [CoffeesService],
// })

@Module({ 
        imports: [
            TypeOrmModule.forFeature([Coffee, Flavor, Event]), 
            ConfigModule.forFeature(coffeesConfig)
        ],
        controllers: [CoffeesController], 
        providers:  [CoffeesService],
        exports:  [CoffeesService],
    })
export class CoffeesModule {}
