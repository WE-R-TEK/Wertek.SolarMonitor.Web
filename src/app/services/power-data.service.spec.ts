import { TestBed } from '@angular/core/testing';

import { PowerDataService } from './power-data.service';

describe('PowerDataService', () => {
  let service: PowerDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
