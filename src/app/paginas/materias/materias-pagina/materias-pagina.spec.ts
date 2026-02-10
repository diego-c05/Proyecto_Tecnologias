import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasPagina } from './materias-pagina';

describe('MateriasPagina', () => {
  let component: MateriasPagina;
  let fixture: ComponentFixture<MateriasPagina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasPagina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriasPagina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
