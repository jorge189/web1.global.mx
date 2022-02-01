import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DireccionesService } from 'src/app/services/direcciones.service';

@Component({
  selector: 'app-dialogo-direccion',
  templateUrl: './dialogo-direccion.component.html',
  styleUrls: ['./dialogo-direccion.component.css']
})
export class DialogoDireccionComponent implements OnInit {

  forma: FormGroup;
  loading: boolean = false;
  direcciones: any;
  activo: number = 0;
  direccion: any = null;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, private wsDireccion: DireccionesService) {
    this.forma = new FormGroup({
      'texto': new FormControl('', Validators.required),
      'predeterminado': new FormControl(false)
    });
  }

  ngOnInit() {
  }

  buscarDir() {
    this.loading = true;
    console.log(this.forma, this.data);
    this.wsDireccion.searchDireccion(this.forma.value.texto, this.data.paqueteria).subscribe((data: any) => {
      this.loading = false;
      this.direcciones = data;
      console.log(data)
    })
  }

  addDireccion(iddireccion){
    this.activo = iddireccion;
    this.direccion = this.direcciones.find(elemento => elemento.iddireccion == iddireccion);
    console.log(this.direccion)
  }

  usarDireccion(){
    console.log(this.forma.value);
    if(this.forma.value.predeterminado == true){
        this.wsDireccion.setPredeterminado(this.direccion.iddireccion, this.data.tipo, this.data.paqueteria).subscribe((data:any) => {
          console.log(data);
        });
    }
    this.dialogRef.close(this.direccion);
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
