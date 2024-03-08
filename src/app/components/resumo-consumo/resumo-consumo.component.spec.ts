import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoConsumoComponent } from './resumo-consumo.component';

describe('ResumoConsumoComponent', () => {
  let component: ResumoConsumoComponent;
  let fixture: ComponentFixture<ResumoConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoConsumoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResumoConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
