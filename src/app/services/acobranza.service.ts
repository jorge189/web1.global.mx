import { Injectable } from '@angular/core';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';

@Injectable({
  providedIn: 'root'
})
export class AcobranzaService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) { }

  getAclaracionesDias(pagina, cantidad, search, dias, paqueteria) {
    this.auth.activate();
    // rcobranza?cantidad=5&pagina=1&search&dias=90&paqueteria=fedex 
    return this.app.getQuery(`public/rcobranza?pagina=${pagina}&cantidad=${cantidad}&search=${search}&dias=${dias}&paqueteria=${paqueteria}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getAclaracionesTracking(pagina, cantidad, search, tracking, paqueteria) {
    this.auth.activate();
    return this.app.getQuery(`public/rcobranza?pagina=${pagina}&cantidad=${cantidad}&search=${search}&tracking=${tracking}&paqueteria=${paqueteria}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  getAclaraciones(cantidad, pagina, search) {
    this.auth.activate();
    return this.app.getQuery(`public/cobranza?cantidad=${cantidad}&pagina=${pagina}&search=${search}`, 'GET').pipe(map((data: any) => {
      return data;
    }));
  }
  setAclaracion(info) {
    this.auth.activate();
    return this.app.getQuery('public/cobranza', "POST", info).pipe(map((data: any) => {
      return data;
    }));
  }
}
