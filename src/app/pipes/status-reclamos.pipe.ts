import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusReclamos'
})
export class StatusReclamosPipe implements PipeTransform {

  transform(value: string): string {

    switch (parseInt(value)) {
      case 1:
        return 'Finalizada';
      case 2:
        return 'En Proceso';
      case 0:
        return 'Recibida';
      default:
        return '';
    }

  }

}
