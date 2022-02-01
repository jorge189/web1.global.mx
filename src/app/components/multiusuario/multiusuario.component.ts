import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';
import {MatDialog} from '@angular/material/dialog';
import { NuevoUsuarioComponent } from '../dialogos/nuevo-usuario/nuevo-usuario.component';

@Component({
  selector: 'app-multiusuario',
  templateUrl: './multiusuario.component.html',
  styleUrls: ['./multiusuario.component.css']
})
export class MultiusuarioComponent implements OnInit {

  carga: boolean;
  search: string = '';
  totalPaginas: number;
  cantidad: number = 5;
  paginaActiva: number = 1;
  paginas: any[] = [];
  init: boolean = false;
  loading: boolean = false;
  usuarios: any[] = [];
  error: boolean = false;
  errMsg:string = '';

  constructor(private wsMulti:  MultiusuarioService,
    private dialogRef: MatDialog) { }

  ngOnInit() {
    
    this.getUsuarios(1, this.cantidad);
  }

  recargar() {
    this.init = false;
    this.getUsuarios(1, this.cantidad);
  }

  async getUsuarios(pagina: number = 1, cantidad) {
    this.carga = true;
    this.usuarios = [];
    this.loading = true;
    this.error = false;
    this.wsMulti.getUsuarios(pagina, cantidad).subscribe((data: any) => {
      console.log(data)
      this.loading = false;
      if (data.error) {
        this.error = true;
        this.errMsg = data.message;
        this.paginas = [];
        return;
      }
      for (let i in data.data) {
        data.data[i].editar = false;
      }
      this.usuarios = data.data;
      if (this.init == false) {
        this.init = true;
        this.totalPaginas = Math.ceil(data.total / this.cantidad);
        console.log(this.totalPaginas)
        this.paginas = [];
        this.paginaActiva = 1;
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

  async verPagina(pagina) {
    if (this.paginaActiva == pagina) {
      return;
    }
    this.paginaActiva = pagina;
    await this.getUsuarios(pagina, this.cantidad);
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

  changeStatus(idusuario:number, status:number){
    this.wsMulti.changeStatus(idusuario, status).subscribe((data:any) => {
      if(data.error){
        return;
      }
      let i = this.usuarios.findIndex(element => element.idusuario == idusuario);
      this.usuarios[i].activo = status;
    });
  }

  nuevoUsuario(){
    const dialog = this.dialogRef.open(NuevoUsuarioComponent, {
      width: '800px'
    });

    dialog.afterClosed().subscribe((data:any) => {
      if(data === undefined){
        return;
      }
      if(!data.ok){
        return;
      }
      this.recargar();
    });
  }


}

