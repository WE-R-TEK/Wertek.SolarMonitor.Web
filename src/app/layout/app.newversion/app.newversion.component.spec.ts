import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNewversionComponent } from './app.newversion.component';

describe('AppNewversionComponent', () => {
  let component: AppNewversionComponent;
  let fixture: ComponentFixture<AppNewversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNewversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppNewversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
