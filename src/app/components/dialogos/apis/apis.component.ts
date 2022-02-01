import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApisService } from 'src/app/services/apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.css']
})
export class ApisComponent implements OnInit {
  token: any;
  name: any;
  status: string;
  mostrar = false;
  fila: any
  idt: number
  id: number
  constructor(public dialogRef: MatDialogRef<ApisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private app: ApisService, private _snackBar: MatSnackBar) {

  }
  onNoClick(): void {
    this.dialogRef.close({ view: this.data.view, name: this.name, token: this.data.idtoken, id: this.data.indice });

  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 3000,
    });
  }
  ngOnInit() {
  }
  borrar(idtoken: number) {
    this.fila = this
    this.idt = idtoken

    if (this.idt) {

      this.app.deleteToken(this.idt).subscribe((data: any) => {

        if (data.data == true) {
          this.openSnackBar('se elimino el token ' + data.idtoken);
        }
        else {
          this.status = data.data;
        }
      });
    }
    if (this.status) {
      this.openSnackBar(this.status)
    }
    return

  }


}
