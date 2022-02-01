import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zona'
})
export class ZonaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
