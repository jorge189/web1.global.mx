import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ajaxSetup } from 'jquery';
import { CuponesService } from 'src/app/services/cupones.service';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { DialogoInfoComponent } from '../../dialogos/dialogo-info/dialogo-info.component';

@Component({
  selector: 'app-crear-cupon',
  templateUrl: './crear-cupon.component.html',
  styleUrls: ['./crear-cupon.component.css']
})
export class CrearCuponComponent implements OnInit {

  @Output() nuevoCupon: EventEmitter<any> = new EventEmitter();

  paqueteria: string = "fedex";
  diaSig: any[];
  terr: any[];
  disponibles: any[];
  cantidad: any;
  cantidadEnabled = true;
  asegurar = "";
  zona_extendida = false;
  sobrepeso = false;
  recoleccion = false;
  numeroCliente: number;
  checkeda = false;
  checkedb = false;
  checkedc = false;
  disabledButton = false;
  Alerta = false;
  selectCantidad = 0;
  selectDisponibles = "";
  mensaje = "";
  selectTipo = "";
  constructor(private wsGlobal: GlobalpaqService, private wsCupon: CuponesService, public dialog: MatDialog) { }

  ngOnInit() {
    this.cambiarPaqueteria('fedex');
  }

  llenarDisponibles(tipoguia) {
    if (tipoguia == 1) {
      this.disponibles = this.diaSig;
    } else if (tipoguia == 2) {
      this.disponibles = this.terr
    }
  }
  openDialog(data: any, cupones) {
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      data: {
        tipoVista: 'cuponCreado',
        titulo: data,
        cupon: cupones
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }
  cambiarPaqueteria(paqueteria) {
    this.paqueteria = paqueteria;
        this.wsGlobal.getGuiasDisponibles(paqueteria).subscribe((data: any) => {
          console.log(data);
          this.diaSig = data.diaSig;
          this.terr = data.terrestre;
        });
  }
  changeTipo(v) {
    this.llenarDisponibles(v);
  }
  cantidadGenerar(v) {

    this.cantidad = Array.from({ length: v.split('-')[2] });
    this.cantidadEnabled = false;
  }
  generarCupon() {
    if (!this.selectTipo) {
      this.Alerta = true;
      this.mensaje = "Debe de Ingresar un Tipo de Guia."
      return
    }
    if (!this.selectDisponibles) {
      this.Alerta = true;
      this.mensaje = "Debe de Ingresar una Guia Disponible"
      return
    }
    if (!this.selectCantidad) {
      this.Alerta = true;
      this.mensaje = "Seleccione la cantidad de cupones a generar"
      return
    }
    this.Alerta = false;
    let zon;
    let sob;
    let re;
    let arreglo = {
      "idtipoguia": Number(this.selectDisponibles.split('-')[0]),
      "peso": Number(this.selectDisponibles.split('-')[1]),
      "crear_cupon": "true",
      "seguro": Number(this.asegurar),
      "zona_extendida": zon = (this.checkeda ? 1 : 0),
      "sobrepeso": sob = (this.checkedb ? 1 : 0),
      "numCliente": this.numeroCliente,
      "numCupones": Number(this.selectCantidad),
      "recoleccion": re = (this.checkedc ? 1 : 0)
    }
    this.wsCupon.createCupon(arreglo).subscribe((data: any) => {
      if (data.error == false) {
        this.openDialog('Cupon Generado Correctamente', data.response);
        this.nuevoCupon.emit(1);
      }
    });
  }
  keyCliente(v) {
  }
  keySeguro(v) {

    if (v > 0) {
      this.Alerta = true;
      this.disabledButton = true;
      this.mensaje = "Para asegurar es necesario que sea a partir de $1000"
    } else if (v < 999) {
      this.Alerta = true;
      this.mensaje = "Para asegurar es necesario que sea a partir de $1000"
      this.disabledButton = true;
    }
    if (v > 999) {
      this.Alerta = false;
      this.disabledButton = false;
    }
    if (v == 0) {
      this.Alerta = false;
      this.disabledButton = false;
    }
  }
}