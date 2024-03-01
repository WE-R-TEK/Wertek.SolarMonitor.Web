import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNewversionCheckerComponent } from './app.newversion.checker.component';

describe('AppNewversionCheckerComponent', () => {
  let component: AppNewversionCheckerComponent;
  let fixture: ComponentFixture<AppNewversionCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNewversionCheckerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppNewversionCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
