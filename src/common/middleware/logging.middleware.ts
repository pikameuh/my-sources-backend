/* LoggingMiddleware FINAL CODE */
import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Color } from '../enums/colors.enum';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {

  nbLoggingCall: number = 0;

  use(req: any, res: any, next: () => void) {
    this.nbLoggingCall++;
    const titleId = " " + Color.Underscore + 'Request-response #' + this.nbLoggingCall + Color.Reset;
    console.time(titleId);
    console.log('\n' + titleId);
    
    
    res.on('finish', () => console.timeEnd(titleId));
    next(); 
  }
}