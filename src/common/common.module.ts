import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guards';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { TimeTrackerMiddleware } from './middleware/timetracker.middleware';

@Module({ 
    imports: [ConfigModule],
    providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard}],
})
export class CommonModule implements NestModule{

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware)//, TimeTrackerMiddleware)
                .forRoutes('*');

        // --- Apply on all GET request for coffees controller
        // consumer.apply(LoggingMiddleware)
        //         .forRoutes({ path: 'coffees', method: RequestMethod.GET});

        // --- Apply on all except ones with prefix coffees
        // consumer.apply(LoggingMiddleware)
        //         .exclude('coffees')
        //         .forRoutes('*');
    }
}
