import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({})
export class DatabaseModule {
    /**
     * 
     * @param options - all the options needed for the Dtabase configuration
     * @returns 
     */
    static register(options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [{
                provide: 'CONNECTION',
                useValue: createConnection(options), 
            }]
        }
    }
}
