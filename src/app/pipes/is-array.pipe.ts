import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isArray'
})
export class IsArrayPipe implements PipeTransform {

  transform(value: any[]): boolean {

    if(value.length < 0){
      return false;
    }

    return true;
  }

}
