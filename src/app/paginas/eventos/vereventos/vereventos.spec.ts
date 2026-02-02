import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vereventos } from './vereventos';

describe('Vereventos', () => {
  let component: Vereventos;
  let fixture: ComponentFixture<Vereventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vereventos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vereventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
