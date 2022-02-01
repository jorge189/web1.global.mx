import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutinfo'
})
export class CutinfoPipe implements PipeTransform {

  transform(value: string, length:number = 15): string {
    if(!value){
      return 'Usuario';
    }

    if(value.length > length){
      let nuevotexto = value.substr(0, length) + '...';
      return nuevotexto;
    }else{
      return value;
    }
  }

}
