import { TestBed } from '@angular/core/testing';

import { PowerTaxValueService } from './power-tax-value.service';

describe('PowerTaxValueService', () => {
  let service: PowerTaxValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerTaxValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
