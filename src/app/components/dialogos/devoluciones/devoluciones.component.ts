import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DevolucionGuiaService } from 'src/app/services/devolucion-guia.service';
import { TiendaService } from 'src/app/services/tienda.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CuentaComponent } from '../../asociado/cuenta/cuenta.component';
import { CompilerFacadeImpl } from '@angular/compiler/src/jit_compiler_facade';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent implements OnInit {

  mostrar: boolean = true;
  selected = 1;
  titulo = "Devolucion de Guias";
  respHistorial: any[] = [];
  todo: any[] = [];
  historialTipo: any[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  loading:boolean = false;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, private wsdevolucion: DevolucionGuiaService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.data.tipoVista = this.titulo;
    this.getDevoluciones(this.data.idarticulo, this.data.peso, this.data.tipo);
    this.getPorTipo(this.data.peso, this.data.tipo);

  }
  onNoClick(): void {
    this.dialogRef.close();

  }
  cambio() {
    this.mostrar = !this.mostrar;
    if (this.mostrar != true) {
      this.titulo = "Historial de Devoluciones";
    } else { this.titulo = "Devolucion de Guias" }
  }

  getPorTipo(peso, tipo) {
    this.wsdevolucion.getDevolucionByTipo(peso, tipo).subscribe((data: any) => {
      if (data.error) {
        return;
      }
      this.historialTipo = data.data;
    });
  }

  getDevoluciones(idarticulo, peso, tipo) {
    this.todo = [];
    this.respHistorial = [];
    this.loading = true;
    this.wsdevolucion.getDevolucionsHist(idarticulo).subscribe(async (data: any) => {

      if (data.error) {
        return;
      }
      this.respHistorial = data.data;

      let disp = this.data.disponibles;

      for (let i in this.respHistorial) {
        if(this.todo.length <= 0){
          await new Promise((resolve) => {
  
            this.wsdevolucion.getDevolucionByNota(this.respHistorial[i].idventa, peso, tipo).subscribe((data: any) => {
              let total = data.data.totalDevoluciones;
              let cantidadb;
              if (disp < this.respHistorial[i].cantidad) {
                cantidadb = disp - total;
                if (cantidadb < 0) {
                  cantidadb = disp
                }
                this.respHistorial[i].arrayCantidad = new Array(cantidadb);
              } else {
                cantidadb = this.respHistorial[i].cantidad - total;
                disp = this.data.disponibles - cantidadb;
                this.respHistorial[i].arrayCantidad = new Array(Number(this.respHistorial[i].cantidad - total));
              }
  
              if (cantidadb < total) {
              } else {
                this.todo.push({
                  tipo: tipo,
                  peso: peso,
                  cantidad: this.respHistorial[i].cantidad,
                  idventa: this.respHistorial[i].idventa,
                  disponibles: cantidadb,
                  regreso: total,
                  precio: this.respHistorial[i].montoR,
                  totalDisponibles: this.respHistorial[i].arrayCantidad,
                });
              }
              resolve('ok');
            });
          });
        }else{
          break;
        }
      }
      this.loading = false;
    });
  }

  devolverGuia(data, indice) {
    let guia = {
      idarticulo: this.data.idarticulo,
      id_tipo_guia: data.tipo,
      peso: data.peso,
      idventaOperacion: data.idventa,
      paqueteria: this.data.paqueteria,
      devoluciones_solicitadas: this.selected
    };
    console.log(this.selected);
    if(this.selected < 1){
      this._snackBar.open('Debe ser mayor a 0', 'Cerrar', {
        duration: 500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      return;
    }
    this.wsdevolucion.setDevolucion(guia).subscribe((data: any) => {
      if (data.error == false) {
        this._snackBar.open('Guias Devueltas Correctamente', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.data.disponibles = this.data.disponibles - this.selected;
        this.getDevoluciones(this.data.idarticulo, this.data.peso, this.data.tipo);
        this.getPorTipo(this.data.peso, this.data.tipo);
        this.selected = 0;

      } else {
        this._snackBar.open('Error Al Devolver Su Guia', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }
}