import { Component, OnInit } from '@angular/core';
import { TiendaService } from 'src/app/services/tienda.service';
import { Articulo } from 'src/app/classes/articulos';
import { MatDialog } from '@angular/material/dialog';
import { DialogoInfoComponent } from '../dialogos/dialogo-info/dialogo-info.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  articulos: any;
  carga: boolean = false;
  precio: number = 0;

  constructor(private wsTienda: TiendaService,
    private wsArticulo: Articulo,
    public dialog: MatDialog,
    private router: Router) {

  }

  ngOnInit() {
    this.wsTienda.getArticulos().subscribe(data => {
      this.articulos = data;
      this.carga = true;
      console.log(this.articulos);
    });
  }

  agregarProducto(articulo, cantidad) {
    console.log(articulo)
    if (this.precio > 0) {
      articulo.precio = this.precio;
    }

    if (cantidad < 1) {
      let message = `<span class="icon-attention-circled h1 mx-5 px-5"></span>
    <span>La cantidad tiene que ser mayor a ${cantidad}</span>`;
      this.openDialogErrorPermisos(1, message);
      return;
    }
    if (articulo.precio < 1) {
      let message = `<span class="icon-attention-circled h1 mx-5 px-5"></span>
    <span>El precio tiene que ser mayor a 0</span>`;
      this.openDialogErrorPermisos(1, message);
      return;
    }
    console.log(articulo.facturacion);
    if (articulo.facturacion) {
      if (cantidad < parseInt(articulo.facturacion)) {
        let message = `<span class="icon-attention-circled h1 mx-5 px-5"></span>
    <span>La cantidad tiene que ser mayor a ${cantidad}</span>`;
        this.openDialogErrorPermisos(articulo.facturacion, message);
        return;
      }
    }
    if(articulo.articulo.includes('CAJA')){
      let idCotizador = `${Math.random() * (10000 - 1) + 1}_${moment().format('YYYYMMDDHHmmss')}`;
      articulo.idcotizador = idCotizador;
    }
    this.wsTienda.addCarrito(articulo, cantidad).subscribe(data => {
      console.log(data);
      if (data.insert == 1) {
        articulo.cantidad = cantidad;
        this.wsTienda.cantidad += 1;
        this.openDialogAddCar(articulo);
      }
    });
  }

  openDialogAddCar(articulo: any): void {

    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '500px',
      data: {
        articulo,
        tipoVista: 'addCarrito'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.router.navigateByUrl('/carrito');
      }
    });
  }

  cambiarNombre(articulo: string) {
    // console.log(this.wsArticulo.cambiarNombre(articulo));
    return this.wsArticulo.cambiarNombre(articulo);
  }

  openDialogErrorPermisos(cantidad, message) {
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '500px',
      data: {
        tipoVista: 'errorPermiso',
        message: `
        <p class="alert alert-danger d-flex justify-content-center flex-wrap">
            ${message}
        </p>
        `
      }
    });
  }

}
