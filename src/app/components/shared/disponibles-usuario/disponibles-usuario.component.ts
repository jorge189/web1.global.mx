import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogoInfoComponent } from '../../dialogos/dialogo-info/dialogo-info.component';


@Component({
  selector: 'app-disponibles-usuario',
  templateUrl: './disponibles-usuario.component.html',
  styleUrls: ['./disponibles-usuario.component.css']
})
export class DisponiblesUsuarioComponent implements OnInit, OnChanges {

  cantidad:number = 5;
  paginaActiva:number = 1;
  carga: boolean;
  search: string = '';
  totalPaginas: number;
  paginas: any[] = [];
  init: boolean = false;
  loading: boolean = false;
  asignaciones: any[] = [];
  error: boolean = false;
  errMsg:string = '';

  @Input() paqueteria:string = '';
  @Input() idusuario:string = '';
  @Output() cambiosPaq: EventEmitter<any> = new EventEmitter();

   constructor(private wsMulti: MultiusuarioService,
    private dialogRef: MatDialog) { }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.paqueteria != ''){
      this.recargar();
    }
  }

  recargar() {
    this.init = false;
    this.getAsignaciones(1, this.cantidad);
  }

  async getAsignaciones(pagina: number = 1, cantidad) {
    this.carga = true;
    this.asignaciones = [];
    this.loading = true;
    this.error = false;
    this.wsMulti.getAsignaciones(this.paqueteria,cantidad, pagina, Number(this.idusuario)).subscribe((data: any) => {
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
      this.asignaciones = data.data;
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
    await this.getAsignaciones(pagina, this.cantidad);
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

  deleteAsignacion(asig:any){
    if(asig.disponibles < 1){
      return;
    }
    this.dialogDelete(asig);
  }

  dialogDelete(item:any){
    let dialog = this.dialogRef.open(DialogoInfoComponent, {
      width: '300px',
      data: {
        tipoVista: 'deleteAsignacion',
        ...item,
        idusuario: this.idusuario
      }
    });

    dialog.afterClosed().subscribe((data:any) => {
      console.log('close dialog', data)
      if(!data.item){
        return;
      }
      console.log(data.item.idtipoguia ,data.item.peso)
      let i = this.asignaciones.findIndex(element => Number(element.idtipoguia) == Number(data.item.idtipoguia) && Number(element.peso) == Number(data.item.peso));
      console.log(i)
      this.asignaciones[i].total = Number(this.asignaciones[i].total) - Number(data.item.disponibles);
      this.asignaciones[i].disponibles = Number(this.asignaciones[i].disponibles) - Number(data.item.disponibles);
      this.cambiosPaq.emit('ok');
    });
  }

}
