import { NgControl } from '@angular/forms';
import { EmployeeIdDirective } from './employee-id.directive';

describe('EmployeeIdDirective', () => {
  it('should create an instance', () => {
    const ngControl = { control: null } as NgControl;
    const directive = new EmployeeIdDirective(ngControl);
    expect(directive).toBeTruthy();
  });
});
