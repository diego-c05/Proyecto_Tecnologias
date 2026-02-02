import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEvents } from './detalle-events';

describe('DetalleEvents', () => {
  let component: DetalleEvents;
  let fixture: ComponentFixture<DetalleEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
