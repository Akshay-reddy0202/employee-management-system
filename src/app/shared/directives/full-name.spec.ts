import { NgControl } from '@angular/forms';
import { FullNameDirective } from './full-name-directive';

describe('FullNameDirective', () => {
  it('should create an instance', () => {
    const ngControl = { control: null } as NgControl;
    const directive = new FullNameDirective(ngControl);
    expect(directive).toBeTruthy();
  });
});
