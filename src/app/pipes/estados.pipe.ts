import { Pipe, PipeTransform } from '@angular/core';
import { estados } from '../classes/estados';

@Pipe({
  name: 'estados'
})
export class EstadosPipe implements PipeTransform {

  transform(value: string): string {  
    let resultado = estados.find(elemento => elemento.aestado === value);
    return resultado.estado;
  }

}
