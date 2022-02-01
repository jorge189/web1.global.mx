import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalpaqService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) {

  }

  getGuiasDisponibles(paqueteria: string) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/disponibles`, "GET").pipe(map((data: any) => {
      // console.log(data)
      if(!data.data){
        return
      }

      return {
        diaSig: data.data.filter(guia => guia.descripcion.indexOf('DIA SIG') >= 0 && guia.disponibles > 0),
        terrestre: data.data.filter(guia => guia.descripcion.indexOf('TERR') >= 0 && guia.disponibles > 0)
      }

    }));
  }
  cancelGlobalpaq(tracking: string) {
    this.auth.activate();
    return this.app.getQuery(`public/globalpaq/cancelar/${tracking}`, "GET").pipe(map((data: any) => {
      return data
    }));
  }


  getHistorial(dias = 0, fechaInicio = '', fechaFin = '', paqueteria = 'fedex', pagina:number, cantidad:number, search:string) {
    this.auth.activate();
    if (dias > 0) {
      return this.app.getQuery(`public/${paqueteria}/historial?&dia=${dias}&pagina=${pagina}&cantidad=${cantidad}`, "GET").pipe(map((data: any) => {
        return data;
      }));
    } else if (fechaInicio != '' && fechaFin != '') {
      return this.app.getQuery(`public/${paqueteria}/historial?&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&pagina=${pagina}&cantidad=${cantidad}`, "GET").pipe(map((data: any) => {
        return data;
      }));
    } else {
      return this.app.getQuery(`public/${paqueteria}/historial`, "GET").pipe(map((data: any) => {
        return data.data;
      }));
    }
  }
  getHistorialGlobalpaq({pagina = 1, cantidad = 4, status = 0, fecha_inicio = '2000-01-01', fecha_fin = moment().format('YYYY-MM-DD'), search = ''}) {
    this.auth.activate();
    return this.app.getQuery(`public/globalpaq/historial?pagina=${pagina}&cantidad=${cantidad}&status=${status}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&search=${search}`, "GET").pipe(map((data: any) => {
      return data;
    }));

  }

  getHistorialGlobalpaqFile({pagina = 1, cantidad = 4, status = 0, fecha_inicio = '2000-01-01', fecha_fin = moment().format('YYYY-MM-DD'), search = '', file}) {
    this.auth.activate();
    return this.app.getQuery(`public/globalpaq/historial/file?pagina=${pagina}&cantidad=${cantidad}&status=${status}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&search=${search}&file=${file}&idhijo=0`, "GET").pipe(map((data: any) => {
      return data;
    }));
  }


  getStatusTracking(tracking, paqueteria) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/tracking/${tracking}`, "GET").pipe(map((data: any) => {
      return data.data;
    }))
  }

  cancelarGuia(tracking, paqueteria) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/cancelar/${tracking}`, "GET").pipe(map((data: any) => {
      return data.data;
    }));
  }

  getHistorialFile(dias = 0, fechaInicio = '', fechaFin = '', paqueteria = 'fedex') {
    this.auth.activate();
    if (dias > 0) {
      return this.app.getFileQuery(`public/${paqueteria}/historial/file?tipo=2&dia=${dias}`, "GET");
    } else if (fechaInicio != '' && fechaFin != '') {
      return this.app.getFileQuery(`public/${paqueteria}/historial/file?tipo=2&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`, "GET");
    } else {
      return this.app.getFileQuery(`public/${paqueteria}/historial/file`, "GET");
    }
  }

  getMovimientos(cantidad: number, pagina: number, paqueteria: string) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/asignaciones?cantidad=${cantidad}&pagina=${pagina}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }

  getCobertura(origen: string, destino: string, paqueteria: string) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/cobertura?cp_origen=${origen}&cp_destino=${destino}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }

  generateTracking(paqueteria: string, data: any) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/guia`, 'POST', data).pipe(map((data: any) => {
      return data;
    }));
  }

  generateRecoleccion(paqueteria: string, data: any) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/recoleccion`, 'POST', data).pipe(map((data: any) => {
      return data;
    }));
  }

  sendGuiaByEmail(link, email) {
    this.auth.activate();
    return this.app.getQuery(`public/guia/email?link=${link}&email=${email}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }

  validarRecoleccion(tracking: string, paqueteria: string) {
    this.auth.activate();
    return this.app.getQuery(`public/recoleccion/${paqueteria}/validar?tracking=${tracking}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getImages(){
    this.auth.activate();
    return this.app.getQuery(`public/utils/images`, 'GET').pipe(map((data:any) => {
        return data;
    }));
  }

  getPendientes(pagina:number, cantidad:number){
    this.auth.activate();
    return this.app.getQuery(`public/globalpaq/pendientes?pagina=${pagina}&cantidad=${cantidad}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  getZonaGlobalpaq(origen:string, destino:string){
    this.auth.activate();
    return this.app.getQuery(`public/globalpaq/zona?origen=${origen}&destino=${destino}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

}
