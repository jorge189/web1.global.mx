import { Component, OnChanges, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AvisosService } from 'src/app/services/avisos.service';
import { DialogoAvisosComponent } from '../../dialogos/dialogo-avisos/dialogo-avisos.component';
import { TipsComponent } from '../tips/tips.component';

@Component({
  selector: 'app-tabla-avisos',
  templateUrl: './tabla-avisos.component.html',
  styleUrls: ['./tabla-avisos.component.css']
})
export class TablaAvisosComponent implements OnInit, OnChanges {

  paginaActiva: number = 1;
  paginas: any[] = [];
  totalPaginas: number;
  init: boolean = false;
  cantidad: number = 4;
  avisos:any[]=[];
  @Input() recargar: number = 0;
  constructor(private wsAvisos:AvisosService,public dialog:MatDialog) { }

  ngOnInit() {
    this.getAvisos(this.cantidad,1,'');
  }

  ngOnChanges(){
      this.init = false;
      this.getAvisos(this.cantidad, 1 ,'');
  }

  getAvisos(cantidad,pagina,search){
        this.wsAvisos.getAviso(cantidad,pagina,search).subscribe((data:any) => {
            if (data.error) {
                return;
            }
            this.avisos=data.data;
                this.totalPaginas = Math.ceil(data.total / this.cantidad);
                this.paginas = [];
          
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
     this.getAvisos(this.cantidad,pagina ,'');
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
      this.paginaActiva=1;
      this.getAvisos(4,1,value);

  }
  modificar(id,limite,paqueteria,tipo,peso,nombre){
      let info= {
          'limite':limite,
          'id':id,
          'titulo':paqueteria,
          'subtitulo':'Recordarme cuando mis guiaslleguen a:',
          'tipo':tipo,
          'peso':peso,
          'paqueteria':nombre
      }
      this.dialogo(info,'modificar');
  }
  btnEliminar(id,limite,paqueteria,tipo,peso,nombre){
    let info= {
        'id':id,
        'titulo':'Eliminar Aviso de '+paqueteria+' ?',
        'subtitulo':'Esta eleccion no podra deshacerse posteriormente.',
        'paqueteria':nombre
    }
    this.dialogo(info,'eliminar');
  }

  dialogo(info,accion){
    const dialogRef = this.dialog.open(DialogoAvisosComponent, {
        data: {
            vista:accion,
            data:info,
        },
        width: "600px"
    });

    dialogRef.afterClosed().subscribe(result => {
        this.init = false;
        this.getAvisos(this.cantidad, 1, '');
        this.paginaActiva=1;
    });
  }

}
