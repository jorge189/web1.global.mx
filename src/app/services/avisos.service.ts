import { Injectable } from '@angular/core';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) { }


  setAviso(info) {
    this.auth.activate();
    return this.app.getQuery('public/avisos', "POST", info).pipe(map((data: any) => {
      return data;
    }));
  }

  getAviso(cantidad,pagina,search) {
    this.auth.activate();
    return this.app.getQuery(`public/avisos?cantidad=${cantidad}&pagina=${pagina}&search=${search}`, "GET").pipe(map((data: any) => {
      return data;
    }));
  }

  deleteAviso(id){
    this.auth.activate();
    return this.app.getQuery(`public/avisos?id=${id}`, "DELETE").pipe(map((data: any) => {
      return data;
    }));
  }
  updateAviso(info){
    this.auth.activate();
    return this.app.getQuery('public/avisos','PUT',info).pipe(map((data:any) => {
      return data
    }));
  }

  getAvisoPaq(paqueteria:string){
    this.auth.activate();
    return this.app.getQuery(`public/avisos/${paqueteria}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }
}
