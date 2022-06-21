import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffees.entity';
import { Flavor } from './entities/flavor.entity';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
      ]
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    // for other scope provider ('request','transient') -> use resolve instead
    // service = await module.resolve(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
