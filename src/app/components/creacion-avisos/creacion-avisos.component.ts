import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-creacion-avisos',
  templateUrl: './creacion-avisos.component.html',
  styleUrls: ['./creacion-avisos.component.css']
})
export class CreacionAvisosComponent implements OnInit {
  paqueteria: string = "fedex";
  diaSig: any[];
  terr: any[];
  disponibles: any[];
  cantidad: any;
  cantidadEnabled = true;
  selectCantidad = 1;
  selectDisponibles;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  cambio: number = 0;
  disabledButton = true;
  selectTipo = 1;

  constructor(private wsGlobal: GlobalpaqService, private wsAviso: AvisosService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.cambiarPaqueteria('fedex');
  }


  cambiarPaqueteria(paqueteria) {
    this.paqueteria = paqueteria;
    this.disabledButton = true;
    this.selectDisponibles = "";
    this.cantidadEnabled = true;
    this.selectTipo = 1;
    this.wsGlobal.getGuiasDisponibles(paqueteria).subscribe((data: any) => {
      console.log(data);
      this.diaSig = data.diaSig;
      this.terr = data.terrestre;
    });
  }

  changeTipo(v) {
    this.llenarDisponibles(v);
  }

  llenarDisponibles(tipoguia) {
    if (tipoguia == 1) {
      this.disponibles = this.diaSig;
    } else if (tipoguia == 2) {
      this.disponibles = this.terr
    }
  }
  cantidadGenerar(v) {
    this.cantidad = Array.from({ length: v.split('-')[2] });
    this.cantidadEnabled = false;
    this.disabledButton = false;
  }
  generarAviso() {
    let tipo = this.selectDisponibles.split('-')[0];
    let peso = this.selectDisponibles.split('-')[1];
    let idtipoguia = this.selectDisponibles.split('-')[3];
    let descripcion = this.selectDisponibles.split('-')[4];
    let nombre;
    if (descripcion.indexOf('TERRESTRE') >= 0) {
      nombre = this.paqueteria.charAt(0).toUpperCase() + this.paqueteria.slice(1) + ' Terrestre';
    } else {
      nombre = this.paqueteria.charAt(0).toUpperCase() + this.paqueteria.slice(1) + ' Express';
    }
    let info = {
      paqueteria: nombre,
      nombre: this.paqueteria,
      idtipo_guia: tipo,
      id_articulo: idtipoguia,
      peso: peso,
      minimo: this.selectCantidad
    }
    this.wsAviso.setAviso(info).subscribe((data: any) => {

      if (data.error == false) {
        this.snackbar.open('Aviso Configurado Correctamente', 'Cerrar', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.cambio += 1;
      } else {
        this.snackbar.open(data.message, 'Cerrar', {
          duration: 1500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }



    });

  }

}
