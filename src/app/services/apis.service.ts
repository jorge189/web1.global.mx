import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private app:Peticiones ,private auth: AuthenticatedService, private http: HttpClient) { }

  getTokens(cantidad,pagina){
    this.auth.activate();
    return this.app.getQuery(`public/utils/token?cantidad=${cantidad}&pagina=${pagina}`, 'GET').pipe(map((data:any) => {
      return data;
    }));

  }
  deleteToken(id){
    this.auth.activate();
    return this.app.getQuery(`public/utils/token?idtoken=${id}`, 'DELETE').pipe(map((data:any) => {
      return data;
    }));            
  }
  createToken(nombre:any){
    // console.log(params);
    this.auth.activate();
    return this.app.getQuery(`public/utils/token`,'POST',nombre).pipe(map((data:any) => {
      return data;
    }));  
  }
  sendMaterial(data:any){
    this.auth.activate();
    return this.app.getQuery(`public/utils/material`,'POST',data).pipe(map((data:any) => {
      return data;
    }));
  }

  getMaterial(paqueteria:string){
    this.auth.activate();
    return this.app.getQuery(`public/utils/material/${paqueteria.toUpperCase()}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  sendCommentary(data:any){
    this.auth.activate();
    return this.app.getQuery(`public/utils/feedback`,'POST',data).pipe(map((data:any) => {
      return data;
    }));
  }

  getFormasPago(){
    return this.http.get('https://sistema.globalpaq.mx/api/v0/public/formas-pago/html', {responseType: 'text'})
  }

}
