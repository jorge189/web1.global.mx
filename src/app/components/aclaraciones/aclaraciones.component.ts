import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReclamosService } from 'src/app/services/reclamos.service';
import { DialogoInfoComponent } from '../dialogos/dialogo-info/dialogo-info.component';
import { MatDialog } from '@angular/material';
import { DialogoReclamoComponent } from '../dialogos/dialogo-reclamo/dialogo-reclamo.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';


@Component({
  selector: 'app-aclaraciones',
  templateUrl: './aclaraciones.component.html',
  styleUrls: ['./aclaraciones.component.css']
})
export class AclaracionesComponent implements OnInit {

  carga: boolean = false;
  forma: FormGroup;
  loading: boolean = true;

  reclamos: any[];
  disabled: boolean = false;
  totalRegistros: number;
  paginas: any[] = [];
  activeAnterior: boolean = false;
  activeSiguiente: boolean = false;
  paginaActive: number = 1;
  cantidadRegistros: number;
  auxiliar: any[] = [];
  numPaginas: number;

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private wsReclamos: ReclamosService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.carga = true;
    this.forma = new FormGroup({
      'registros': new FormControl('5', Validators.required)
    });
  }

  ngOnInit() {
    this.visualizar();
  }

  visualizar() {
    this.reiniciar();
    this.getReclamos(1);
    setTimeout(() => {
      this.numPaginas = Math.ceil(this.totalRegistros / this.forma.value.registros);
      if (this.numPaginas > 1) {
        this.activeSiguiente = true;
      }
      console.log(this.numPaginas);
      for (let i = 1; i <= this.numPaginas; i++) {
        if (i == 6) {
          break;
        }
        this.paginas.push(i);
      }
      this.loading = true;
      this.disabled = false;
    }, 1500);
  }

  getReclamos(pagina: number) {
    this.wsReclamos.getReclamos(this.forma.value.registros, pagina).subscribe((data: any) => {
      console.log(data);
      this.reclamos = data.data;
      this.totalRegistros = data.total;
      this.carga = true;
      return data;
    });
  }

  verPagina(pagina: number) {
    //Si pagina es mayor o igual a 3 y la cantidad de paginas es mayor o igual a 5,
    //limpia el arreglo de paginas y reacomoda los numeros
    if (pagina >= 3 && pagina < this.numPaginas - 1 && this.numPaginas >= 5) {
      this.paginas = [];
      for (let i = pagina - 2; i <= pagina + 2; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina == 2 && pagina < this.numPaginas - 1 && this.numPaginas >= 5) {
      this.paginas = [];
      for (let i = pagina - 1; i <= pagina + 3; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina == this.numPaginas - 1 && pagina <= this.numPaginas - 1 && this.numPaginas >= 5) {
      this.paginas = [];
      for (let i = pagina - 3; i <= pagina + 1; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == this.numPaginas || this.numPaginas == 1) {
      this.activeSiguiente = false;
    } else if (pagina < this.numPaginas) {
      this.activeSiguiente = true;
    }


    window.scroll(0, 70);
    this.getReclamos(pagina);
    this.paginaActive = pagina;
    if (pagina == 1) {
      this.activeAnterior = false;
    } else {
      this.activeAnterior = true;
    }

  }

  verSiguiente() {
    this.paginaActive += 1;
    this.verPagina(this.paginaActive);
  }

  verAnterior() {
    this.paginaActive -= 1;
    this.verPagina(this.paginaActive);
  }

  reiniciar() {
    this.reclamos = [];
    this.auxiliar = [];
    this.cantidadRegistros = this.forma.value.registros;
    this.loading = false;
    this.paginas = [];
    this.activeAnterior = false;
    this.activeSiguiente = false;
    this.paginaActive = 1;
    this.disabled = true;
  }

  verReclamo(reclamo: any): void {
    console.log(reclamo)
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '850px',
      data: {
        reclamo,
        tipoVista: 'verReclamos'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        console.log('ok');
      }
    });
  }

  verComentarios(reclamo: any): void {
    const dialogRef = this.dialog.open(DialogoInfoComponent, {
      width: '850px',
      data: {
        reclamo,
        tipoVista: 'verComentarios'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        console.log('ok');
      }
    });
  }

  nuevoReclamo(tipo) {
    const dialogRef = this.dialog.open(DialogoReclamoComponent, {
      width: '900px',
      data: {
        tipo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.visualizar();
        this.openSnackBar('Aclaración enviada correctamente!', 'CERRAR');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 8000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

}
