import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userNotLoggedInGuard } from './user-not-logged-in.guard';

describe('userNotLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userNotLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
