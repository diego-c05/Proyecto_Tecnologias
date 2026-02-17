import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmiInscripciones } from './admi-inscripciones';

describe('AdmiInscripciones', () => {
  let component: AdmiInscripciones;
  let fixture: ComponentFixture<AdmiInscripciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmiInscripciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmiInscripciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
