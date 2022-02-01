import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {

  forma:FormGroup;
  paqueteria:string = 'fedex';
  movimientos:any[];
  loading: boolean = false;
  disabled: boolean = false;
  totalRegistros: number;
  paginas: any[] = [];
  activeAnterior: boolean = false;
  activeSiguiente: boolean = false;
  paginaActive: number = 1;
  cantidadRegistros: number;
  auxiliar: any[] = [];
  numPaginas: number;
  carga:boolean = false;

  constructor(private wsGlobal:GlobalpaqService) { 
    this.forma = new FormGroup({
      'registros': new FormControl('5', Validators.required)
    });
  }

  ngOnInit() {
    this.visualizar();
  }

  cambiarPaqueteria(paqueteria){
    this.paqueteria = paqueteria;
    this.loading = false;
  }

  visualizar(){
    this.reiniciar();
    this.getMovimientos(1, this.paqueteria);
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

  getMovimientos(pagina:number, paqueteria: string){
    this.wsGlobal.getMovimientos(this.forma.value.registros, pagina, paqueteria).subscribe((data:any) => {
      console.log(data);
      this.movimientos = data.data;
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
    this.getMovimientos(pagina, this.paqueteria);
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
    this.movimientos = [];
    this.auxiliar = [];
    this.cantidadRegistros = this.forma.value.registros;
    this.loading = false;
    this.paginas = [];
    this.activeAnterior = false;
    this.activeSiguiente = false;
    this.paginaActive = 1;
    this.disabled = true;
  }

}
