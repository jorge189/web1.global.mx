import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CuentaComponent } from '../../asociado/cuenta/cuenta.component';
import { CompilerFacadeImpl } from '@angular/compiler/src/jit_compiler_facade';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { AvisosService } from 'src/app/services/avisos.service';

@Component({
  selector: 'app-dialogo-avisos',
  templateUrl: './dialogo-avisos.component.html',
  styleUrls: ['./dialogo-avisos.component.css']
})
export class DialogoAvisosComponent implements OnInit {

  cantidad: any = [1];
  selected = 1;
  disponibles: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private wsGlobal: GlobalpaqService, private wsAvisos: AvisosService) {
  }

  ngOnInit() {
    if (this.data.vista == 'modificar') {
      this.getDisponibles(this.data.data.paqueteria);
    }
    // this.cantidad=Array.from({length:v.split('-')[2]});
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getDisponibles(paqueteria) {

    this.wsGlobal.getGuiasDisponibles(paqueteria).subscribe((data: any) => {
      const resultado1 = data.diaSig.find(tipo => tipo.tipo === this.data.data.tipo);
      if (resultado1) {
        this.disponibles = resultado1.disponibles;
        this.cantidad = Array.from({ length: this.disponibles });
      }
      const resultado2 = data.terrestre.find(tipo => tipo.tipo === this.data.data.tipo);
      if (resultado2) {
        this.disponibles = resultado2.disponibles;
        this.cantidad = Array.from({ length: this.disponibles });
      }
    });
  }

  modificar() {
    let info = {
      limite: this.selected,
      id: this.data.data.id
    }
    this.wsAvisos.updateAviso(info).subscribe((data: any) => {
      if (!data.error) {
        this.onNoClick();
        this._snackBar.open('Aviso Configurado Correctamente', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.onNoClick();
        this._snackBar.open('Hubo un Error Comuniquese Con Su Administrador', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }

  delete() {
    this.wsAvisos.deleteAviso(this.data.data.id).subscribe((data: any) => {
      if (!data.error) {
        this.onNoClick();
        this._snackBar.open('Aviso Eliminado Correctamente', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      } else {
        this.onNoClick();
        this._snackBar.open('Hubo un Error Comuniquese Con Su Administrador', 'Cerrar', {
          duration: 500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
    });
  }


}
