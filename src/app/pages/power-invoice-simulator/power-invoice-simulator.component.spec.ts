import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerInvoiceSimulatorComponent } from './power-invoice-simulator.component';

describe('PowerInvoiceSimulatorComponent', () => {
  let component: PowerInvoiceSimulatorComponent;
  let fixture: ComponentFixture<PowerInvoiceSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerInvoiceSimulatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PowerInvoiceSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
