import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoGeracaoComponent } from './consumo-geracao.component';

describe('ConsumoGeracaoComponent', () => {
  let component: ConsumoGeracaoComponent;
  let fixture: ComponentFixture<ConsumoGeracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoGeracaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumoGeracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
