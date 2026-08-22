import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesTable } from './employees-table';

describe('EmployeesTable', () => {
  let component: EmployeesTable;
  let fixture: ComponentFixture<EmployeesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesTable],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
