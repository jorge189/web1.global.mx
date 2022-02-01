import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticatedService } from '../auth/authenticated.service';
import { Peticiones } from '../classes/peticiones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  public cantidad:number;

  constructor(private app:Peticiones, private auth: AuthenticatedService) { }

  getArticulos(){
    this.auth.activate();
    return this.app.getQuery(`public/tienda/articulos`, 'GET').pipe(map((data:any) => {
      // console.log(data);
      let articulos = [];
      for(let articulo of data.data.articulos){
        articulos.push(articulo);
      }
      // for(let articulo of data.data.autofact){
      //   articulos.push(articulo);
      // }
      return articulos;
    }));
  }

  addCarrito(articulo,cantidad){
    this.auth.activate();
    // console.log(articulo);
    articulo.cantidad = cantidad;
    return this.app.getQuery(`public/tienda/carrito`, 'POST', articulo).pipe(map((data:any) => {
        return data;
    }));      
  }

  getCarrito(){
    this.auth.activate();
    return this.app.getQuery('public/tienda/carrito', 'GET').pipe(map((data:any) => {
      // console.log(data);
      this.cantidad = data.data.length;
      return data.data;
    }));
  }

  borrarArticulo(id:number, tipo:string){
    let data = `${tipo}=${id}`;
    this.auth.activate();
    return this.app.getQuery(`public/tienda/carrito?${data}`, 'DELETE').pipe(map((data:any) => {
      return data;
    }));
  }

  addOrden(razon:number){
    this.auth.activate();
    return this.app.getQuery(`public/tienda/orden?razon=${razon}`, 'GET').pipe(map((data:any) => {
      return data.data;
    }));
  }

  getDetallePedido(id:number){
    this.auth.activate();
    return this.app.getQuery(`public/tienda/pedidos/${id}`, 'GET').pipe(map((data:any) => {
      return data.data;
    }));
  }

  getPedidos(cantidad, pagina){
    this.auth.activate();
    return this.app.getQuery(`public/tienda/pedidos?cantidad=${cantidad}&pagina=${pagina}`, 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  sendComprobante(body:any){
    this.auth.activate();
    return this.app.sendFileQuery('public/tienda/comprobante', body).pipe(map((data:any) => {
      console.log(data);
      return data.data;
    }));
  }

  getFactura(id:number){
    this.auth.activate();
    return this.app.getQuery(`public/tienda/factura/${id}`, 'GET').pipe(map((data:any) => {
      return data.data;
    }));
  }

  getPermisos(){
    this.auth.activate();
    return this.app.getQuery('public/cotizador/permisos', 'GET').pipe(map((data:any) => {
      return data.data;
    }))
  }

  getCotizador(data){
    this.auth.activate();
    return this.app.getQuery('public/cotizador', 'POST', data).pipe(map((data:any) => {
      return data.data;
    }));
  }

  getListaServicio(){
    this.auth.activate();
    return this.app.getQuery('public/cotizador/lista', 'GET').pipe(map((data: any) => {
      return data.data;
    }));
  }


  getSaldoFavor(){
    this.auth.activate();
    return this.app.getQuery('public/pagos/saldo', 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  getSaldoPrepago(){
    this.auth.activate();
    return this.app.getQuery('public/pagos/prepago', 'GET').pipe(map((data:any) => {
      return data;
    }));
  }

  pagarSaldoFavor(idventa:number, factura:boolean){
    this.auth.activate();
    return this.app.getQuery('public/pagos', 'POST', {idventa, factura: (factura) ? 1 : 0}).pipe(map((data:any) => {
      return data;
    }));
  }
  pagarSaldoPrepago(idventa:number, factura:boolean){
    this.auth.activate();
    return this.app.getQuery('public/pago/saldoprepago', 'POST', {idventa,factura}).pipe(map((data:any) => {
      return data;
    }));
  }
  pagarPaypal(idventa:number, factura:boolean,monto:number){
    this.auth.activate();
    return this.app.getQuery('public/pagos/paypal', 'POST', {idventa,factura,monto}).pipe(map((data:any) => {
      return data;
    }));
  }
  mercadoPago(object){
    this.auth.activate();
    return this.app.getQuery('public/pagos/mercado', 'POST', {object}).pipe(map((data:any) => {
      return data;
    }));
  }

  getPaqueterias(){
    this.auth.activate();
    return this.app.getQuery('public/paqueterias', 'GET').pipe(map((data:any) => {
      return data;
    }));
  }
  getRazonSocial(){
    this.auth.activate();
    return this.app.getQuery('public/utils/razon', 'GET').pipe(map((data:any) => {
      return data.data;
    }));
  }

}
