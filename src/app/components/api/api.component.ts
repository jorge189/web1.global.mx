import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApisComponent } from '../dialogos/apis/apis.component';
import { ApisService } from 'src/app/services/apis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { promise } from 'protractor';


//




/*
totalPaginas: number;
cantidad: number = 4;
paginaActiva: number = 1;
paginas: any[] = [];
init: boolean = false;*/
@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
  token: any;

  totalPaginas: number;
  cantidad: number = 5;
  paginaActiva: number = 1;
  paginas: any[] = [];
  mov: any[] = [];
  init: boolean = false;
  totalReg: number;
  plus: number = 1
  name: any;
  mensaje: string = "token genereado";
  msj: string
  action: string = "CERRAR";
  status: number;
  token2: any[] = [];
  array: any = []
  constructor(public dialog: MatDialog, private wsToken: ApisService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getTokens(1);
  }

  async getTokens(pagina: number = 1) {
    this.mov = [];
    this.wsToken.getTokens(this.cantidad, pagina).subscribe((data: any) => {

      
      this.mov = data.data;
      this.array = this.mov
      if (this.init == false) {
        this.init = true;
        this.totalReg = Number(data.total)
        this.totalPaginas = Math.ceil(data.total / this.cantidad);
        this.paginas = [];
      } else {
        return;
      }
      for (let i = 1; i < this.totalPaginas; i++) {
        if (i > 5) {
          return;
        }
        this.paginas.push(i);
      }
    });
  }

  async verPagina(pagina) {
    if (this.paginaActiva == pagina) {
      return;
    }
    this.paginaActiva = pagina;
    await this.getTokens(pagina);
    if (this.totalPaginas <= 5) {
      return;
    }
    this.paginas = [];
    if (pagina >= 3 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 2; i <= pagina + 2; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina >= 3 && this.totalPaginas > 5 && pagina == this.totalPaginas - 1) {
      for (let i = pagina - 3; i <= pagina + 1; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina == 2 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 1; i <= pagina + 3; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == this.totalPaginas && this.totalPaginas > 5) {
      for (let i = pagina - 4; i <= pagina; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == 1 && this.totalPaginas > 5) {
      for (let i = pagina; i <= pagina + 4; i++) {
        this.paginas.push(i);
      }
    }
  }
  abrir_plugins(view: string, idtoken, name, indice) {
    const dialogRef = this.dialog.open(ApisComponent, {
      data: {
        view,
        name,
        idtoken,
        indice
      }

    });
    dialogRef.afterClosed().subscribe(async (result) => {
   
      if (result <= 5) {
        this.array.splice(result, 1);
        this.totalReg = this.totalReg - this.plus;
      }
      this.token = result.idtoken;
      if (this.token) {
      }
      this.name = result.name;
      this.msj = this.mensaje + " " + this.name
      if (this.name) {
        let data = await new Promise((resolve) => {

          this.wsToken.createToken({ nombre: this.name }).subscribe((data: any) => {
            this.status = data.status;
            this.totalReg = this.totalReg + this.plus;
            resolve(this.totalReg);

          });
        })
        this.getTokens(1);
        this._snackBar.open(this.msj, this.action, {
          duration: 3000,
        });

      }

      //fin del dialogref  
    });

  };



  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
