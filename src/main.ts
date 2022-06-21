import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Dto validator
  app.useGlobalPipes(
    new ValidationPipe({
      // Make sure all unwanted element of request are removed
      // ex: creating coffee with unkown parameter (ex: "isEnabled": true) will be ignored
      whitelist: true,
      // force the received object to be in the good instanceOf
      // ex: creating coffee with unkown parameter, will 're-instanciate' the dto as create-coffee.dto
      transform: true,
      // refuse to process request with non whitelisted value in the request 
      forbidNonWhitelisted: true,
      // equivalent to '' but globaly
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  // --Allow CORS (for angular communication)
  const cors = require("cors");
  const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  }

  app.use(cors(corsOptions))

  // Swagger /api
  // Setting up Swagger document 
  const options = new DocumentBuilder()
    .setTitle('my-sources')
    .setDescription('Sources management')
    .setContact('Astek - bj901398@gmail.com', 'www.monsite.fr', 'bj901398@gmail.com')
    .setLicense('Licence importante', 'www.malicence.fr')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
