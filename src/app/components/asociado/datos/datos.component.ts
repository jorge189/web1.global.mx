import { Component, OnInit } from '@angular/core';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoAsociadoComponent } from '../../dialogos/dialogo-asociado/dialogo-asociado.component';
import { AsociadoService } from 'src/app/services/asociado.service';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

  info: any;
  loading: boolean = false;
  razonSocial: any;

  constructor(private wsAsociado: AsociadoService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = false;
    this.wsAsociado.getInfoAsociado().subscribe((data: any) => {
      this.info = data;
      console.log(this.info);
      this.wsAsociado.getRazones().subscribe((data: any) => {
        this.razonSocial = data.filter(element => element.predeterminado == "1")[0];
        this.loading = true;
      });
    });

    
  }

  cambiarDato(info, tipoVista: string) {
    const dialogRef = this.dialog.open(DialogoAsociadoComponent, {
      width: '400px',
      data: {
        info,
        tipoVista
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result == 0 || result == undefined) {
        return;
      }
      if(result.razon){
        this.razonSocial = result.razon;
        return;
      }
      this.info = result;
    });
  }

  enviarCodigo(info, tipo) {
    // console.log(telefono);
    const dialogRef = this.dialog.open(DialogoAsociadoComponent, {
      width: '400px',
      data: {
        info,
        tipo,
        tipoVista: 'validar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }



}
