import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkReclamo'
})
export class LinkReclamoPipe implements PipeTransform {

  transform(value: any, file: string): any {

    let link = 'https://sistema.globalpaq.mx/files/aclaraciones/';

    switch (value) {
      case 'guia':
        return `${link}guias/${file}`;
      case 'FotoExt1':
      case 'FotoExt2':
        return `${link}fotos_ext/${file}`;
      case 'FotoInt1':
      case 'FotoInt2':
        return `${link}fotos_int/${file}`;
      case 'NotaFactura':
        return `${link}facturas/${file}`;
    }

    return null;
  }

}
