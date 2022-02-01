import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CuponesService } from 'src/app/services/cupones.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ver-cupon',
  templateUrl: './ver-cupon.component.html',
  styleUrls: ['./ver-cupon.component.css']
})
export class VerCuponComponent implements OnInit, OnChanges {

  @Input() newData:number = 0;  
  totalPaginas: number;
  cantidad: number = 4;
  paginaActiva: number = 1;
  paginas: any[] = [];
  init: boolean = false;
  cupones:any[];
  search:String = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private wsCupones:CuponesService,private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getCupones(this.paginaActiva,this.cantidad);
  }

  ngOnChanges(){
    this.getCupones(1,this.cantidad);
  }

  getCupon(){
    this.wsCupones.getCupones(1,5,'').subscribe((data:any)=> {
      console.log(data);
    });
  }
     getCupones(pagina: number = 1, cantidad) {
      this.cupones = [];
      this.wsCupones.getCupones(pagina, cantidad,this.search).subscribe((data: any) => {
          if (data.error) {
              return;
          }
          this.cupones = data.data;
          if (this.init == false) {
              this.init = true;
              this.totalPaginas = Math.ceil(data.total / this.cantidad);
              console.log(this.totalPaginas)
              this.paginas = [];
          } else {
              return;
          }
          for (let i = 1; i <= this.totalPaginas; i++) {
              if (i > 5) {
                  return;
              }
              this.paginas.push(i);
          }
      });
  }
  
   verPagina(pagina) {
      if (this.paginaActiva == pagina) {
          return;
      }
      this.paginaActiva = pagina;
       this.getCupones(pagina, this.cantidad);
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

    buscar(value){
        console.log(value);
        this.search = value;
        this.paginaActiva=1;
        this.init=false;
        this.getCupones(this.paginaActiva,this.cantidad);

    }

    btnEliminar(id:any){
        console.log(id);
        this.wsCupones.deleteCupon(id).subscribe((data:any)=> {
            let i = this.cupones.findIndex(element => element.id == id);
            this.cupones[i].usado = 2;
            if(data.error == false){
                if(data.response == true){
                    this.openSnackBar('Cupon cancelado correctamente');
                }else{
                    this.openSnackBar(data.response);
                }

            }
            
            console.log(data);
          });
    }
    openSnackBar(texto) {
        this._snackBar.open(texto, 'Cerrar', {
          duration: 2500,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
  }

