import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';


@Module({
  imports: [
    CoffeesModule,
    /**
     * Custom parametre for Database config
     */
    DatabaseModule.register({
      type: 'postgres', // type of our database
      host: 'localhost', // database host
      port: 5433, // database host
      username: 'postgres', // username
      password: 'P0st3Gr@is', // user password
      database: 'postgres', // name of our database,
      synchronize: true, // your entities will be synced with the database (recommended: disable in prod)
    }),  
  ],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
