import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listarmaterias } from './listarmaterias';

describe('Listarmaterias', () => {
  let component: Listarmaterias;
  let fixture: ComponentFixture<Listarmaterias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listarmaterias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listarmaterias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
