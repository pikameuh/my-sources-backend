/* TimeTrackerMiddleware FINAL CODE */
import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class TimeTrackerMiddleware implements NestMiddleware {

  use(req: any, res: any, next: () => void) {
    console.time('TimeTrackerMiddleware Request-response time');
    console.log('Hi TimeTracker ' + req);
    
    res.on('finish', () => console.timeEnd('TimeTrackerMiddleware Request-response time'));
    next(); 
  }
}