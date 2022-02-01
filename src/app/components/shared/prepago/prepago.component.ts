import { Component, OnInit } from '@angular/core';
import { AsociadoService } from 'src/app/services/asociado.service';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: 'app-prepago',
  templateUrl: './prepago.component.html',
  styleUrls: ['./prepago.component.css']
})



export class PrepagoComponent implements OnInit {

  public consoleMessages: string[] = [];
  public userQuestion: string;
  userQuestionUpdate = new Subject<string>();

  saldo:number=0
  totalPaginas: number;
  cantidad: number = 5;
  paginaActiva: number = 1;
  paginas: any[] = [];
  mov: any[] = [];
  init: boolean = false;
  totalReg: number;
  plus: number = 1
  name: any;
  status: number;
  array: any = [];
  buscar:any="";





  constructor(private wsAsociado: AsociadoService) {
    this.userQuestionUpdate
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(value => {

          this.buscar=value

        this.paginaActiva=1;
        this.init=false;
        console.log(value);
        this.getTokens(this.paginaActiva,this.cantidad,this.buscar);

      });

   }

  ngOnInit() {
    this.getTokens(this.paginaActiva,this.cantidad,'');
    // this.wsAsociado.getSaldoPrepago(5,1).subscribe((data: any) =>{
    //   console.log(data)
    // });
  }
  async getTokens(pagina: number = 1,cantidad,buscar) {
    this.mov = [];
    this.wsAsociado.getSaldoPrepago(cantidad, pagina,buscar).subscribe((data: any) => {
      console.log(data.totalreg)
      this.saldo=data.totalsaldo
      this.mov = data.data;
      this.array = this.mov
      if (this.init == false) {
        this.init = true;
        this.totalReg = data.totalreg
        this.totalPaginas = Math.ceil(data.totalreg / this.cantidad);
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
    await this.getTokens(pagina,this.cantidad,this.buscar);
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
//   buscador(value){

//     this.buscar=value
//     setTimeout(()=>{                           //<<<---using ()=> syntax
//       console.log(this.buscar);
//       ;
//  }, 3000);
//     this.paginaActiva=1;
//     this.init=false;
//     // this.getTokens(this.paginaActiva,this.cantidad,value);

// }


}
