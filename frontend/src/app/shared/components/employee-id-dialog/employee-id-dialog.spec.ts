import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIdDialog } from './employee-id-dialog';

describe('EmployeeIdDialog', () => {
  let component: EmployeeIdDialog;
  let fixture: ComponentFixture<EmployeeIdDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeIdDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeIdDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
