import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialHoras } from './historial-horas';

describe('HistorialHoras', () => {
  let component: HistorialHoras;
  let fixture: ComponentFixture<HistorialHoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialHoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialHoras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
