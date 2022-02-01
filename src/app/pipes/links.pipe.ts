import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'links'
})

@Injectable({
  providedIn: 'root'
})

export class LinksPipe implements PipeTransform {

  transform(value: string, paqueteria: string, ruta: string, tracking:string, idtipoguia: number): any {

    // if (idtipoguia == 31) {
    //   return `${environment.wsUrlDhl}/guia/${tracking}`;
    // }
    // if (idtipoguia == 32 || idtipoguia == 31) {
    //   return `${environment.wsUrlDhlDia}/guia/${tracking}`;
    // }
    if ((idtipoguia == 37 || idtipoguia == 38) && value != 'normal') {
      return `${environment.wsUrlEstafeta}/guia/${tracking}`;
    }
    console.log(idtipoguia, 'idtipoguia')
    if (idtipoguia == 48 || idtipoguia == 49) {
      return `${environment.wsUrlPaquetexpress}/api/guia/${tracking}`;
    }
    if (idtipoguia == 46 || idtipoguia == 47) {
      return `${environment.wsUrlGlobalpaq}/guia/file/${tracking}`;
    }
    if (value === 'normal') {
      return `https://sistema.globalpaq.mx/${paqueteria}/guias/${ruta}`;
    }

  }

}
