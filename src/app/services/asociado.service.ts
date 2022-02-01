import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AsociadoService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) { }

  getInfoAsociado() {
    this.auth.activate();
    return this.app.getQuery('public/asociado/info', "GET").pipe(map((data: any) => {
      if (data.data.nombreU == "EMANUEL VARGAS GOMEZ") {
        data.data.nombreU = "DANIELA HERNANDEZ ORTIZ";
        data.data.correoU = "coordinacion.comercial@globalpaq.com";
      }
      return data.data;
    }));
  }

  setInfoAsociado(info) {
    this.auth.activate();
    return this.app.getQuery('public/asociado/info', "POST", info).pipe(map((data: any) => {
      return data.data;
    }));
  }

  validarTelefono(telefono) {
    this.auth.activate();
    return this.app.getQuery(`public/asociado/info/telefono?numero=${telefono}`, "GET").pipe(map((data: any) => {
      return data.data;
    }));
  }

  validarCodigo(datos) {
    this.auth.activate();
    return this.app.getQuery(`public/asociado/info/verificacion?codigo=${datos.codigo}&tipo=${datos.tipo}`, 'GET').pipe(map((data: any) => {
      return data.data;
    }));
  }

  getEstadoCuenta(cantidad, pagina) {
    this.auth.activate();
    return this.app.getQuery(`public/asociado/info/cuenta?cantidad=${cantidad}&pagina=${pagina}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getSaldoPrepago(cantidad, pagina,buscar) {
    this.auth.activate();
    return this.app.getQuery(`public/prepago/cuentaPre?cantidad=${cantidad}&pagina=${pagina}&buscar=${buscar}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getTips() {
    this.auth.activate();
    return this.app.getQuery(`public/tips`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }

  /**
   * getRazones
   */
  public getRazones() {
    this.auth.activate();
    return this.app.getQuery(`public/asociado/info/razones`, 'GET').pipe(map((data: any) => {
      return data.data;
    }));
  }

  /**
   * setRazon
   */
  public setRazon(id: number) {
    this.auth.activate();
    return this.app.getQuery(`public/asociado/info/razones`, 'POST', { id }).pipe(map((data: any) => {
      return data;
    }));
  }


  getSeguro(monto: number, paqueteria: string) {
    this.auth.activate();
    return this.app.getQuery(`public/${paqueteria}/seguro?monto=${monto}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }

}
