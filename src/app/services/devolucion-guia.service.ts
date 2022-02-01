import { Injectable } from '@angular/core';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';

@Injectable({
  providedIn: 'root'
})
export class DevolucionGuiaService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) { }

  getDevoluciones(pagina, cantidad, search) {
    this.auth.activate();
    return this.app.getQuery(`public/devolucion?pagina=${pagina}&cantidad=${cantidad}&search=${search}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getDevolucionsHist(tipo) {
    this.auth.activate();
    return this.app.getQuery(`public/historial-devoluciones?tipo=${tipo}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getDevolucionByNota(id_venta, peso, tipo_guia) {
    https://sistema.globalpaq.mx/api/v0/public/devoluciones-generadas?id_venta=368860&peso=1&tipo_guia=38
    this.auth.activate();

    return this.app.getQuery(`public/devoluciones-generadas?id_venta=${id_venta}&peso=${peso}&tipo_guia=${tipo_guia}`, 'GET').pipe(map((data: any) => {
      return data;
    }));

  };
  getDevolucionByTipo(peso, tipo_guia) {
    this.auth.activate();

    return this.app.getQuery(`public/devoluciones-tipo?peso=${peso}&tipo_guia=${tipo_guia}`, 'GET').pipe(map((data: any) => {
      return data;
    }));

  };

  setDevolucion(devolucion) {
    this.auth.activate();
    return this.app.getQuery('public/devolucion', "POST", devolucion).pipe(map((data: any) => {
      return data;
    }));
  }
  setCancelacion(cancelacion) {
    this.auth.activate();
    return this.app.getQuery('public/devolucionMasiva', "POST", cancelacion).pipe(map((data: any) => {
      return data;
    }));
  }
}
