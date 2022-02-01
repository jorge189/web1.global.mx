import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginar'
})
export class PaginarPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
