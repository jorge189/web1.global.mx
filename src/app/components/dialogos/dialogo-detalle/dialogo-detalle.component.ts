import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Articulo } from 'src/app/classes/articulos';

@Component({
  selector: 'app-dialogo-detalle',
  templateUrl: './dialogo-detalle.component.html',
  styleUrls: ['./dialogo-detalle.component.css']
})
export class DialogoDetalleComponent {

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any, private wsArticulo: Articulo) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  cambiarNombre(articulo:string){
    // console.log(this.wsArticulo.cambiarNombre(articulo));
    return this.wsArticulo.cambiarNombre(articulo);
  }

}
