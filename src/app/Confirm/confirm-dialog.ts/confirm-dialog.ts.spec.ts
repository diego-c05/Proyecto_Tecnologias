import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogTs } from './confirm-dialog.ts';

describe('ConfirmDialogTs', () => {
  let component: ConfirmDialogTs;
  let fixture: ComponentFixture<ConfirmDialogTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
