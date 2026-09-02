import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationTable } from './designation-table';

describe('DesignationTable', () => {
  let component: DesignationTable;
  let fixture: ComponentFixture<DesignationTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignationTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
