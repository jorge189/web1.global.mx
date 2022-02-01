import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoDetalleComponent } from '../dialogos/dialogo-detalle/dialogo-detalle.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TiendaService } from 'src/app/services/tienda.service';
import { Articulo } from 'src/app/classes/articulos';
import { DialogoInfoComponent } from '../dialogos/dialogo-info/dialogo-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent implements OnInit {

  formulario: FormGroup;
  name: string;
  color: string;
  pesov: number = 0;
  fedex: any;
  dhl: any;
  estafeta: any;
  redpack:any;
  paquetexpress:any;
  globalpaq:any;
  permisos: any;
  articulos: any[] = [];
  loadArticulos: boolean = false;
  carga: boolean = false;
  message: boolean = false;

  constructor(public dialog: MatDialog,
    private wsTienda: TiendaService,
    private wsArticulo: Articulo,
    private router: Router) {
    this.formulario = new FormGroup({
      'origen': new FormControl('', [Validators.required, Validators.minLength(4)]),
      'destino': new FormControl('', [Validators.required,]),
      'largo': new FormControl('', [Validators.required, Validators.min(1)]),
      'ancho': new FormControl('', [Validators.required, Validators.min(1)]),
      'alto': new FormControl('', [Validators.required, Validators.min(1)]),
      'pesov': new FormControl({ value: '', disabled: true }),
      'peso': new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.carga = true;
  }

  cotizar() {
    this.loadArticulos = true;
    this.message = false;
    let datos = {
      origen: this.formulario.value.origen,
      destino: this.formulario.value.destino,
      largo: this.formulario.value.largo,
      ancho: this.formulario.value.ancho,
      alto: this.formulario.value.alto,
      pesov: this.pesov,
      peso: this.formulario.value.peso
    }
    this.wsTienda.getCotizador(datos).subscribe((data: any) => {
      console.log(data)
      this.fedex = data.fedex;
      this.dhl = data.dhl;
      this.estafeta = data.estafeta;
      this.redpack = data.redpack;
      this.paquetexpress = data.paquetexpress;
      this.globalpaq = data.globalpaq;
      this.permisos = data.permisos;
      this.articulos = data.articulos;
      if(this.articulos.length < 1){
        this.message = true;
      }
      this.loadArticulos = false;
    });

  }

  limpiar() {
    this.formulario.reset();
  }

  Detalles(articulo): void {
    let zona = 0;
    let extraGrande = 0;
    let seguro = 0;
    if (articulo.articulo.includes('FEDEX')) {
      zona = (this.fedex.zona.articulo) ? this.fedex.zona.articulo.precio_0 : 0;
      extraGrande = (this.fedex.extraGrande != null) ? this.fedex.extraGrande.precio_0 : 0;
    } else if (articulo.articulo.includes('DHL')) {
      zona = (this.dhl.zona.articulo) ? this.dhl.zona.articulo.precio_0 : 0;
      extraGrande = (this.dhl.extraGrande != null) ? this.dhl.extraGrande.precio_0 : 0;
    } else if (articulo.articulo.includes('ESTAFETA')) {
      zona = (this.estafeta.zona.articulo) ? this.estafeta.zona.articulo.precio_0 : 0;
      extraGrande = (this.estafeta.extraGrande != null) ? this.estafeta.extraGrande.precio_0 : 0;
    }else if (articulo.articulo.includes('REDPACK')) {
      zona = (this.redpack.zona.articulo) ? this.redpack.zona.articulo.precio_0 : 0;
      extraGrande = (this.redpack.extraGrande != null) ? this.redpack.extraGrande.precio_0 : 0;
    }else if (articulo.articulo.includes('PAQ. EXPRESS')) {
      zona = (this.paquetexpress.zona.articulo) ? this.paquetexpress.zona.articulo.precio_0 : 0;
      extraGrande = (this.paquetexpress.extraGrande != null) ? this.paquetexpress.extraGrande.precio_0 : 0;
    }else if (articulo.articulo.includes('GLOBALPAQ')) {
      zona = (this.globalpaq.zona.articulo) ? this.globalpaq.zona.articulo.precio_0 : 0;
      extraGrande = (this.globalpaq.extraGrande != null) ? this.globalpaq.extraGrande.precio_0 : 0;
    }
    
    articulo.zona = zona;
    articulo.extraGrande = extraGrande
    const dialogRef = this.dialog.open(DialogoDetalleComponent, {
      width: '400px',
      data: { articulo }
    });
  }

  totalVenta(articulo) {
    let total = parseFloat(articulo.precioReal);
    if (articulo.articulo.includes('FEDEX')) {
      total += (this.fedex.zona.articulo) ? parseFloat(this.fedex.zona.articulo.precio_0) : 0;
      total += (this.fedex.extraGrande != null) ? parseFloat(this.fedex.extraGrande.precio_0) : 0;
    } else if (articulo.articulo.includes('DHL')) {
      total += (this.dhl.zona.articulo) ? parseFloat(this.dhl.zona.articulo.precio_0) : 0;
      total += (this.dhl.extraGrande != null) ? parseFloat(this.dhl.extraGrande.precio_0) : 0;
    } else if (articulo.articulo.includes('ESTAFETA')) {
      total += (this.estafeta.zona.articulo) ? parseFloat(this.estafeta.zona.articulo.precio_0) : 0;
      total += (this.estafeta.extraGrande != null) ? parseFloat(this.estafeta.extraGrande.precio_0) : 0;
    } else if (articulo.articulo.includes('REDPACK')) {
      total += (this.redpack.zona.articulo) ? parseFloat(this.redpack.zona.articulo.precio_0) : 0;
      total += (this.redpack.extraGrande != null) ? parseFloat(this.redpack.extraGrande.precio_0) : 0;
    }
    else if (articulo.articulo.includes('PAQ. EXPRESS')) {
      total += (this.paquetexpress.zona.articulo) ? parseFloat(this.paquetexpress.zona.articulo.precio_0) : 0;
      total += (this.paquetexpress.extraGrande != null) ? parseFloat(this.paquetexpress.extraGrande.precio_0) : 0;
    }
    else if (articulo.articulo.includes('GLOBALPAQ')) {
      total += (this.globalpaq.zona.articulo) ? parseFloat(this.globalpaq.zona.articulo.precio_0) : 0;
      total += (this.globalpaq.extraGrande != null) ? parseFloat(this.globalpaq.extraGrande.precio_0) : 0;
    }
    return total.toFixed(2);
  }

  getPesoV() {
    if ((this.formulario.value.alto == null || this.formulario.value.alto == '') || (this.formulario.value.largo == null || this.formulario.value.largo == '') || (this.formulario.value.ancho == null || this.formulario.value.ancho == '')) {
      this.pesov = 0;
    } else {
      //Peso Volumetrico largo * alto * ancho / 5000
      this.pesov = Math.ceil((this.formulario.value.alto * this.formulario.value.largo * this.formulario.value.ancho) / 5000);
    }
  }

  cambiarNombre(articulo: string) {
    return this.wsArticulo.cambiarNombre(articulo);
  }

  zonas(articulo) {
    let existe = false;
    if (articulo.articulo.includes('FEDEX')) {
      existe = (this.fedex.zona.articulo) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('DHL')) {
      existe = (this.dhl.zona.articulo) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('ESTAFETA')) {
      existe = (this.estafeta.zona.articulo) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('REDPACK')) {
      existe = (this.redpack.zona.articulo) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('PAQ. EXPRESS')) {
      existe = (this.paquetexpress.zona.articulo) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('GLOBALPAQ')) {
      existe = (this.globalpaq.zona.articulo) ? true : false;
      return existe;
    }
  }

  extraGrande(articulo) {
    let existe = false;
    if (articulo.articulo.includes('FEDEX')) {
      existe = (this.fedex.extraGrande != null) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('DHL')) {
      existe = (this.dhl.extraGrande != null) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('ESTAFETA')) {
      existe = (this.estafeta.extraGrande != null) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('REDPACK')) {
      existe = (this.redpack.extraGrande != null) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('PAQ. EXPRESS')) {
      existe = (this.paquetexpress.extraGrande != null) ? true : false;
      return existe;
    }
    if (articulo.articulo.includes('GLOBALPAQ')) {
      existe = (this.globalpaq.extraGrande != null) ? true : false;
      return existe;
    }
  }

  agregarCarrito(articulo) {
    if(articulo.restringido1 == 1 && this.permisos.articulo_restringido != 1){
      this.openDialogErrorPermisos();
      return;
    }
    if(articulo.restringido2 == 1 && this.permisos.aut_activo != 1){
      this.openDialogErrorPermisos();
      return;
    }
    let zona = null;
    let extraGrande = null;
    if (articulo.articulo.includes('FEDEX')) {
      zona = (this.fedex.zona.articulo) ? this.fedex.zona.articulo : null;
      extraGrande = (this.fedex.extraGrande != null) ? this.fedex.extraGrande : null;
    } else if (articulo.articulo.includes('DHL')) {
      zona = (this.dhl.zona.articulo) ? this.dhl.zona.articulo : null;
      extraGrande = (this.dhl.extraGrande != null) ? this.dhl.extraGrande : null;
    } else if (articulo.articulo.includes('ESTAFETA')) {
      zona = (this.estafeta.zona.articulo) ? this.estafeta.zona.articulo : null;
      extraGrande = (this.estafeta.extraGrande != null) ? this.estafeta.extraGrande : null;
    } else if (articulo.articulo.includes('REDPACK')) {
      zona = (this.redpack.zona.articulo) ? this.redpack.zona.articulo : null;
      extraGrande = (this.redpack.extraGrande != null) ? this.redpack.extraGrande : null;
    } else if (articulo.articulo.includes('PAQ. EXPRESS')) {
      zona = (this.paquetexpress.zona.articulo) ? this.paquetexpress.zona.articulo : null;
      extraGrande = (this.paquetexpress.extraGrande != null) ? this.paquetexpress.extraGrande : null;
    } else if (articulo.articulo.includes('GLOBALPAQ')) {
      zona = (this.globalpaq.zona.articulo) ? this.globalpaq.zona.articulo : null;
      extraGrande = (this.globalpaq.extraGrande != null) ? this.globalpaq.extraGrande : null;
    }
    
    let date = new Date();
    let idCotizador = `${Math.random() * (10000 - 1) + 1}_${date.getFullYear()}${date.getMonth() + 1}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
    let cantidad = 1;
    if (zona != null) {
      cantidad += 1;
      zona.idcotizador = idCotizador;
      zona.precio = zona.precio_0;
      zona.cantidad = 1;
      this.wsTienda.addCarrito(zona, 1).subscribe((data:any) => {
      });
    }
    if (extraGrande != null) {
      cantidad += 1;
      extraGrande.idcotizador = idCotizador;
      extraGrande.precio = extraGrande.precio_0;
      extraGrande.cantidad = 1;
      this.wsTienda.addCarrito(extraGrande, 1).subscribe((data:any) => {
      });
    }
    articulo.idcotizador = idCotizador;
    articulo.precio = articulo.precioReal;
    articulo.cantidad = 1;
    this.wsTienda.addCarrito(articulo, 1).subscribe((data: any) => {
      if (data.insert == 1) {
        this.wsTienda.cantidad += cantidad;
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
        message: `<h4 class="text-center text-danger">Lo sentimos, no cuenta con el servicio</h4>
          <p class="font-weight-bold text-center">Favor de contactar a un asesor, con gusto le atenderá para resolver sus necesidades de envío.</p>
        `
      }
    });
  }

}

