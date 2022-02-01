import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {

  selectTipo = '1';
  comentario: string = ''
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private wsApis: ApisService, private snack: MatSnackBar) { }

  ngOnInit() {
  }

  enviarComentario() {
    if (this.comentario == '') {
      this.openSnackBar('Debes de ingresar un comentario valido', 'Ok')
      return
    }

    let comentario = {
      'modulo': Number(this.selectTipo),
      'comentario': this.comentario
    }
    console.log(comentario);
    this.wsApis.sendCommentary(comentario).subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        this.openSnackBar(data.message, 'Ok')
      } else {
        this.openSnackBar('Comentario Enviado Correctamente ', 'Ok')
        this.comentario = ''
      
      }
    })
  }
  openSnackBar(message: string, action: string) {
    this.snack.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

}
