import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TiendaService } from 'src/app/services/tienda.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogoInfoComponent } from '../dialogos/dialogo-info/dialogo-info.component';
import { Articulo } from 'src/app/classes/articulos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  forma: FormGroup;
  articulos: any[] = [];
  articulo: any;
  data: any[];
  cargaLista: boolean
  cargaArticulo:boolean;
  carError:boolean = false;
  permisos:any;
  paqueterias:any[] = [];

  constructor(private wsTienda: TiendaService,
              private wsArticulo: Articulo,
              private router:Router,
              public dialog: MatDialog
              ) {
    this.wsTienda.getPermisos().subscribe((data:any) => {
      this.permisos = data;
      console.log(this.permisos);
    })

    this.forma = new FormGroup({
      'paqueteria': new FormControl('FEDEX', Validators.required),
      'tipo': new FormControl('TERR', Validators.required)
    })
    this.cargaLista = false;
    this.wsTienda.getListaServicio().subscribe((data: any) => {
      this.data = data;
      // console.log(data);
      this.verArticulos();
    });

    this.forma.valueChanges.subscribe((data:any) => {
      this.verArticulos();
      // console.log(this.forma);
    });

    this.wsTienda.getPaqueterias().subscribe((data:any) => {
      console.log(data);
      if(data.error){
        return;
      }
      this.paqueterias = data.data;
    });

    console.log(this.permisos);
  }

  ngOnInit() {
  }

  verArticulos() {
    this.cargaArticulo = false;
    this.cargaLista = false;
    this.articulos = [];
    // console.log(this.forma.value.tipo);
    for(let i in this.data){
      if(this.data[i].articulo.indexOf(this.forma.value.paqueteria) >= 0 && this.data[i].articulo.indexOf(this.forma.value.tipo) >= 0){
        this.articulos.push(this.data[i]);
      }
    }
    console.log(this.articulos);
    this.cargaLista = true;
  }

  verDetalleArticulo(articulo){
    this.articulo = articulo;
    this.cargaArticulo = true;
    // console.log(articulo);
  }

  agregarProducto(articulo, cantidad){
    this.carError = false;
    if(cantidad < 1){
      this.carError = true;
      return;
    }
    if(articulo.restringido1 == 1 && this.permisos.articulo_restringido != 1){
      this.openDialogErrorPermisos();
      return;
    }
    if(articulo.restringido2 == 1 && this.permisos.aut_activo != 1){
      this.openDialogErrorPermisos();
      return;
    }
    articulo.precio = articulo.precioReal;
    articulo.cantidad = cantidad;
    this.wsTienda.addCarrito(articulo,cantidad).subscribe(data => {
      console.log(data);
      if(data.insert == 1){
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

  openDialogErrorPermisos(){
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '500px',
      data: {
        tipoVista: 'errorPermiso',
        message: `
        <p class="alert alert-danger d-flex justify-content-center flex-wrap">
            <span class="icon-attention-circled h1 mx-5 px-5"></span>
            <span>Lo sentimos, no cuenta con el servicio.</span>
            <br><br>
                <span class="text-center">Favor de contactar a un Asesor, con gusto le atenderá para resolver sus necesidades de
                    envío.</span>
        </p>
        `
      }
    });
  }

  cambiarNombre(articulo: string) {
    // console.log(this.wsArticulo.cambiarNombre(articulo));
    return this.wsArticulo.cambiarNombre(articulo);
  }

}
