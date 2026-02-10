import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsForm } from './events-form';

describe('EventsForm', () => {
  let component: EventsForm;
  let fixture: ComponentFixture<EventsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
