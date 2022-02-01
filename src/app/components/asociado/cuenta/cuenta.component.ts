import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AsociadoService } from 'src/app/services/asociado.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {
  estado:string="prepago";
  loading: boolean = false;
  disabled: boolean = false;
  registros: any[];
  totalRegistros: number;
  forma: FormGroup;
  paginas: any[] = [];
  activeAnterior: boolean = false;
  activeSiguiente: boolean = false;
  paginaActive: number = 1;
  cantidadRegistros: number;
  auxiliar: any[] = [];
  numPaginas: number;
  saldo: number;
  carga: boolean;
  actual:number;
  pasado:number;
  antepasado:number;
  
  constructor(private wsAsociado: AsociadoService) { 
    this.carga = false;
    this.forma = new FormGroup({
      'registros': new FormControl('5', Validators.required)
    });
    this.wsAsociado.getInfoAsociado().subscribe((data:any) => {
      this.saldo = data.saldo;
    });
  }
  

  ngOnInit() {
    this.visualizar();
   
    
  }
  cambiarEstado(estadocs){
    this.estado=estadocs;
  }
  visualizar() {
    this.reiniciar();
    this.getRegistros(1);
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


  getRegistros(pagina: number) {
    return this.wsAsociado.getEstadoCuenta(this.forma.value.registros, pagina).subscribe((data: any) => {
      console.log(data);
      this.registros = data.data;
      this.totalRegistros = data.total;
      this.actual = data.actual;
      this.pasado = data.pasado;
      this.antepasado = data.antepasado;
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
    window.scroll(0, 70);
    this.getRegistros(pagina);
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
    this.registros = [];
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
