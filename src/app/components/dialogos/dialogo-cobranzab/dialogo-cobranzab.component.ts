import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'app-dialogo-cobranzab',
  templateUrl: './dialogo-cobranzab.component.html',
  styleUrls: ['./dialogo-cobranzab.component.css']
})
export class DialogoCobranzabComponent implements OnInit {
  clave: Number = 0
  monto: string = ''
  comentario: string = ''
  guias: any[] = []
  comentarios: any[] = []
  guiasEnv: any[] = []
  paginaActiva: number = 1;
  paginas: any[] = [];
  totalPaginas: number;
  cantidad: number = 4;


  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    let dat = this.data.data;

    this.clave = (dat.comentario_cbz == null) ? 0 : Number(JSON.parse(dat.comentario_cbz).clave)
    this.monto = (dat.comentario_cbz == null) ? '' : '$ ' + JSON.parse(dat.comentario_cbz).monto
    this.comentarios = (dat.comentario_cbz == null) ? [] : JSON.parse(dat.comentario_cbz).data
    this.comentario = dat.comentario;
    this.guias = JSON.parse(dat.data);


    for (let i = 0; i < this.guias.length; i++) {
      this.guias[i]['pesoVolumetricoo'] = Math.ceil(this.guias[i].row.largo_old * this.guias[i].row.ancho_old * this.guias[i].row.alto_old / 5000)
      this.guias[i]['pesoVolumetricon'] = Math.ceil(this.guias[i].row.largo_new * this.guias[i].row.ancho_new * this.guias[i].row.alto_new / 5000)
      this.guias[i].row['peso_old'] = Math.ceil(this.guias[i].row.peso_old);
      this.guias[i].row['peso_new'] = Math.ceil(this.guias[i].row.peso_new);
      for (let indice = 0; indice < this.comentarios.length; indice++) {
        const result = this.comentarios.filter(word => word.tracking.includes(this.guias[indice].tracking));
        this.guias[indice]['comentario'] = result[0].respuesta;

      }
    }
    this.guiasEnv = this.guias;
    this.paginacion(1);

  }


  paginacion(pagina, guias = this.guias) {
    let inicio = 1

    this.totalPaginas = Math.ceil(guias.length / this.cantidad);

    this.guiasEnv = guias.slice((this.paginaActiva - 1) * this.cantidad, this.paginaActiva * this.cantidad)

    this.paginas = [];
    for (let i = 1; i <= this.totalPaginas; i++) {
      if (i > 5) {
        return;
      }
      this.paginas.push(i);
    }
  }

  verPagina(pagina) {
    if (this.paginaActiva == pagina) {
      return;
    }
    this.paginaActiva = pagina;
    this.paginacion(pagina);
  }

  buscar(value: any) {
    let arr = new Array();
    arr = this.guias;
    const result = arr.filter(word => word.tracking.includes(value) || word.fecha.includes(value) );
    this.guiasEnv = result;
    this.paginaActiva = 1

    this.paginacion(1, this.guiasEnv)
  }

  cerrarDialog(){
    this.dialogRef.close();
  }


}
