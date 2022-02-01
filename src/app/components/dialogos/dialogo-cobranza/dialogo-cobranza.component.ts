import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-dialogo-cobranza',
  templateUrl: './dialogo-cobranza.component.html',
  styleUrls: ['./dialogo-cobranza.component.css']
})
export class DialogoCobranzaComponent implements OnInit {

  datos: any;
  modificar: boolean = false;
  peso_old = 0;
  ancho_old = 0;
  alto_old = 0;
  largo_old = 0;
  paqueteria = ''
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    
    if (this.data.modificar) {
      this.modificar = true;
      this.peso_old = this.data.peso_old
      this.ancho_old = this.data.ancho_old
      this.alto_old = this.data.alto_old
      this.largo_old = this.data.largo_old

    } else {
      this.datos = this.data.data;
      this.paqueteria = this.data.paqueteria;
    }

  }

  close() {
    this.dialogRef.close({
      peso_old: this.peso_old,
      ancho_old: this.ancho_old,
      alto_old: this.alto_old,
      largo_old: this.largo_old,
      modificado: true
    });
  }
  cancel() {
      this.dialogRef.close({
        modificado: false   })
  }

}
