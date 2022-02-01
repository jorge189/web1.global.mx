import { Component, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/services/tienda.service';
import { Articulo } from 'src/app/classes/articulos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  loading:boolean = false;
  carrito: any[];
  total: number = 0;
  cantidad: number = 0;
  btnCancel: number = 0;
  
  razones:any[] ;
  razon:number;
  constructor(public wsTienda:TiendaService, private wsArticulo:Articulo, private router:Router) { }

  ngOnInit() {
    this.loading = false;
    this.wsTienda.getCarrito().subscribe(data=>{
      console.log(data);
      this.carrito = data;
      this.getTotal(this.carrito);
      this.cantidad = this.wsTienda.cantidad;
      this.loading = true;
    });
    // get razon social 
      this.wsTienda.getRazonSocial().subscribe((data:any) =>{
        console.log(data);
        this.razones=data
      });
    
  
  }

  getTotal(carrito){
    for(let articulo of carrito){
      this.total += (articulo.cantidad * articulo.precio);
    }
  }
  
  borrarArticulo(articulo){
    console.log('borrando');
    this.btnCancel = articulo.id;
    let id = (articulo.id_cotizador != null && articulo.id_cotizador != '') ? articulo.id_cotizador : articulo.id;
    let tipo = (articulo.id_cotizador != null && articulo.id_cotizador != '') ? 'id_cotizador' : 'id';
    console.log(id);
    this.wsTienda.borrarArticulo(id, tipo).subscribe((data:any) => {
      console.log(data);
      if(data.delete > 0){
        this.carrito = this.carrito.filter(articulo => articulo[tipo] != id);
        this.total = 0;
        let conteo = 0;
        for(let carrito of this.carrito){
          this.total += (carrito.cantidad * carrito.precio);
          conteo += 1;
        }
        this.wsTienda.cantidad = conteo;
        this.btnCancel = 0;
        // console.log(this.total);
      }
    });
  }

  addOrden(razon){
    // console.log(razon);
    if (!razon) {
      this.razon = 0;
      console.log(this.razon)
    }else{
      this.razon=razon['idrs'];
       console.log(this.razon)
}
    this.wsTienda.addOrden(this.razon).subscribe((data:any) => {
      if(data[0].articulos.length > 0){
        this.wsTienda.cantidad = 0;
        this.router.navigate(['pedido', data[0].idventa]);
      }
    });
  }
  cambiarNombre(articulo:string){
    // console.log(this.wsArticulo.cambiarNombre(articulo));
    return this.wsArticulo.cambiarNombre(articulo);
  }

}
