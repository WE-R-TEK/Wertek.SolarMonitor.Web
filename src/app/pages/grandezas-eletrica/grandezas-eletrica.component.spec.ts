import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandezasEletricaComponent } from './grandezas-eletrica.component';

describe('GrandezasEletricaComponent', () => {
  let component: GrandezasEletricaComponent;
  let fixture: ComponentFixture<GrandezasEletricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandezasEletricaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrandezasEletricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
