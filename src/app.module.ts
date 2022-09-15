/* AppModule - FINAL CODE */
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CoffeesModule } from './coffees/coffees.module';
// import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { AuthModule } from './common/auth/auth.module';
import { UsersModule } from './common/users/users.module';
import { SourcesModule } from './sources/sources.module';
import { UsersController } from './common/users/users.controller';
import { RolesController } from './common/users/roles.controller';

@Module({
  imports: [
    // CoffeesModule,
    // JwtModule.registerAsync({
    //   useFactory: async () => ({
    //     secret: process.env.SECRET,
    //     signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME },
    //   })
    // }),    
    CommonModule,
    AuthModule,
    // DateManagerModule,
    UsersModule,
    
    ConfigModule.forRoot({
      // chose a specific file name for .env => envFilePath: '.environment',
      // ignoring .Env file => ignoreEnvFile: true,

      //Throw an excpetion if database host is missing from config
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),

      load: [appConfig],
    }),

    // Thread safe => will wait that all orhter modules register in the application  => use async + factory
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres', // type of our database
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT, // +variable => cast in number
        username: process.env.DATABASE_USER, 
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE_NAME, 
        autoLoadEntities: true, // models will be loaded automatically 
        synchronize: true, // your entities will be synced with the database (recommended: disable in prod)
      })
    }),
    // CoffeeRatingModule,
    DatabaseModule,
    SourcesModule,
  ],
  controllers: [AppController, UsersController, RolesController],
  providers: [
    AppService,
    // App pipe provider
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // },
  ],
})
export class AppModule {}