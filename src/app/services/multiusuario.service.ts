import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class MultiusuarioService {

  constructor(private app: Peticiones, private auth: AuthenticatedService) { }

  getUsuarios(pagina:number, cantidad:number){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario?pagina=${pagina}&cantidad=${cantidad}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  getUsuario(idusuario:number){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario/${idusuario}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  addUsuario(data:any){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario`, 'POST', data).pipe(map((data:any) => {
      return data;
    }));
  }

  changeStatus(idusuario:number, status:number){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario?idusuario=${idusuario}&status=${status}`, 'DELETE').pipe(map((data:any) => {
      return data;
    }));
  }

  getDisponibles(paqueteria:string){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario/disponibles/${paqueteria}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  agregarGuia(data:any){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario/guia`, 'POST', data).pipe(map((data:any) => {
      return data;
    }));
  }

  getAsignaciones(paqueteria: string, cantidad:number, pagina:number, idusuario:number){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario/guia/${paqueteria}?idusuario=${idusuario}&cantidad=${cantidad}&pagina=${pagina}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  validarUsuario(usuario:string){
    this.auth.activate();
    return this.app.getQuery(`public/multiusuario/usuario/${usuario}`, 'GET').pipe(map((data:any) => {
      return data;
    }))
  }

}
