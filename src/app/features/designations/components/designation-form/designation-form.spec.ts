import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationForm } from './designation-form';

describe('DesignationForm', () => {
  let component: DesignationForm;
  let fixture: ComponentFixture<DesignationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
