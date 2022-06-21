import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogC } from 'src/common/utils/logc';
import { Color } from '../enums/colors.enum';


/**
 * Interceptor to wrap all responses automatically
 */
@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // log.debug('WrapResponseInterceptor before wrapping...');

    // const datas = next.handle();
    

    return next.handle().pipe(map(data => (
      (process.env.DISPLAY_RESPONSES === 'true')? LogC.log(` + sending response(${JSON.stringify(data)})`, Color.FgYellow)
                                                : LogC.log(` + sending response(...)`, Color.FgYellow),
      { 
        // application: 'my-sources',
        // language: 'nestjs',
        version: '1.0',
        // author: 'astek',
        // author_email: 'astek_dev@gmail.com',
        data 
      })));
  }
}

