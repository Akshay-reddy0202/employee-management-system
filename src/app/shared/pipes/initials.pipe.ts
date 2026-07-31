import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialsPipe',
})
export class InitialsPipePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || !value.trim()) {
      return '';
    }
    const words = value.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
}
